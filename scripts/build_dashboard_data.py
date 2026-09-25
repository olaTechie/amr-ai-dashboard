#!/usr/bin/env python3
"""Build dashboard-ready JSON from the validated collated extraction CSV."""

from __future__ import annotations

import csv
import json
import re
import shutil
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT_JSON = ROOT / "public" / "data" / "amr_ai_collated.json"
OUT_CSV = ROOT / "public" / "data" / "collated.csv"
EXTERNAL_SOURCE = ROOT.parent / "extraction_run" / "collated.csv"
SOURCE = EXTERNAL_SOURCE if EXTERNAL_SOURCE.exists() else OUT_CSV

EMPTY = {"", "nr", "n/a", "na", "not reported", "not specified", "none", "null"}

COUNTRY_ALIASES = {
    "usa": "United States",
    "us": "United States",
    "united states of america": "United States",
    "uk": "United Kingdom",
    "republic of korea": "South Korea",
    "korea, republic of": "South Korea",
    "russian federation": "Russia",
}

MODEL_RULES = [
    (r"\bxgboost\b|extreme gradient boost", "XGBoost"),
    (r"\brandom forest\b|\brf\b", "Random Forest"),
    (r"support vector machine|\bsvm\b|svmda", "Support Vector Machine"),
    (r"logistic regression", "Logistic Regression"),
    (r"neural network|\bann\b|deep learning|multilayer perceptron|\bmlp\b", "Neural Network"),
    (r"convolutional neural|\bcnn\b", "CNN"),
    (r"transformer|\bbert\b", "Transformer"),
    (r"gradient boost|lightgbm|catboost|boosted", "Gradient Boosting"),
    (r"decision tree|classification tree|regression tree|\bcart\b|\bchaid\b", "Decision Tree"),
    (r"naive bayes", "Naive Bayes"),
    (r"k-nearest|\bknn\b|\bk-nn\b", "K-Nearest Neighbours"),
    (r"lasso", "LASSO"),
    (r"natural language|\bnlp\b|rule-based", "NLP / Rule-based"),
]

PATHOGEN_RULES = [
    (r"mycobacterium tuberculosis|\bmtb\b", "Mycobacterium tuberculosis"),
    (r"staphylococcus aureus|\bmrsa\b|\bmssa\b", "Staphylococcus aureus"),
    (r"escherichia coli|\be\. ?coli\b", "Escherichia coli"),
    (r"klebsiella pneumoniae|\bk\. ?pneumoniae\b", "Klebsiella pneumoniae"),
    (r"pseudomonas aeruginosa|\bp\. ?aeruginosa\b", "Pseudomonas aeruginosa"),
    (r"acinetobacter baumannii|\ba\. ?baumannii\b", "Acinetobacter baumannii"),
    (r"enterococcus faecium", "Enterococcus faecium"),
    (r"enterococcus faecalis", "Enterococcus faecalis"),
    (r"salmonella", "Salmonella spp."),
    (r"neisseria gonorrhoeae|\bn\. ?gonorrhoeae\b", "Neisseria gonorrhoeae"),
    (r"streptococcus pneumoniae|\bs\. ?pneumoniae\b", "Streptococcus pneumoniae"),
    (r"mycoplasma pneumoniae", "Mycoplasma pneumoniae"),
    (r"candida", "Candida spp."),
]

DRUG_CLASS_RULES = [
    (r"carbapenem", "Carbapenems"),
    (r"cephalosporin", "Cephalosporins"),
    (r"penicillin|beta[- ]?lactam|betalactam", "Beta-lactams / penicillins"),
    (r"fluoroquinolone|quinolone", "Fluoroquinolones"),
    (r"aminoglycoside", "Aminoglycosides"),
    (r"macrolide", "Macrolides"),
    (r"glycopeptide|vancomycin", "Glycopeptides"),
    (r"tetracycline", "Tetracyclines"),
    (r"sulfonamide|trimethoprim", "Folate-pathway inhibitors"),
    (r"rifamp", "Rifamycins"),
    (r"isoniazid", "Isoniazid"),
]


def clean(value: str | None) -> str | None:
    if value is None:
        return None
    value = re.sub(r"\s+", " ", value).strip()
    return None if value.lower() in EMPTY else value


def split_semicolon(value: str | None) -> list[str]:
    value = clean(value)
    if not value:
        return []
    return [part for raw in value.split(";") if (part := clean(raw))]


def countries(value: str | None) -> list[str]:
    values = split_semicolon(value)
    output: list[str] = []
    for value in values:
        canonical = COUNTRY_ALIASES.get(value.lower(), value)
        if canonical not in output:
            output.append(canonical)
    return output


def canonical_matches(text: str | None, rules: list[tuple[str, str]]) -> list[str]:
    text = clean(text)
    if not text:
        return []
    return [label for pattern, label in rules if re.search(pattern, text, re.I)]


def tri_bool(value: str | None) -> bool | None:
    value = clean(value)
    if not value:
        return None
    lower = value.lower()
    if lower in {"yes", "true", "1"}:
        return True
    if lower in {"no", "false", "0"}:
        return False
    return None


def integer(value: str | None) -> int | None:
    value = clean(value)
    if not value:
        return None
    match = re.search(r"\b(19\d{2}|20\d{2})\b", value)
    return int(match.group(1)) if match else None


def first_author(author_year: str | None, doc_id: str) -> str | None:
    source = clean(author_year) or doc_id
    source = re.sub(r"^\d+_", "", source)
    source = re.sub(r"[_ ]?(?:19|20)\d{2}\b.*$", "", source)
    source = re.sub(r"\s*,?\s*et\s+al\.?\s*$", "", source, flags=re.I)
    source = source.replace("_", " ").strip(" ,-")
    return source or None


def parse_metric(value: str | None) -> float | None:
    value = clean(value)
    if not value:
        return None
    candidates: list[float] = []
    for token, pct in re.findall(r"(?<!\d)(\d+(?:\.\d+)?)\s*(%)?", value):
        number = float(token)
        if pct and 0 <= number <= 100:
            candidates.append(number / 100)
        elif 0 <= number <= 1:
            candidates.append(number)
        elif 40 <= number <= 100:
            candidates.append(number / 100)
    return max(candidates) if candidates else None


def maturity(value: str | None) -> int | None:
    value = clean(value)
    if not value:
        return None
    match = re.match(r"\s*([1-6])\b", value)
    return int(match.group(1)) if match else None


def build() -> dict:
    with SOURCE.open(newline="", encoding="utf-8-sig") as handle:
        reader = csv.DictReader(handle)
        source_fields = [field for field in (reader.fieldnames or []) if field != "doc_id"]
        rows = list(reader)

    studies = []
    for row in rows:
        doc_id = row["doc_id"]
        year = integer(row.get("First_Author_Year")) or integer(doc_id)
        country_list = countries(row.get("Country_Countries"))
        pathogens = canonical_matches(row.get("Pathogens"), PATHOGEN_RULES)
        drug_classes = canonical_matches(
            " ".join(filter(None, [row.get("Drug_Classes"), row.get("Specific_Antibiotics")])),
            DRUG_CLASS_RULES,
        )
        models = canonical_matches(
            " ".join(filter(None, [row.get("Best_Performing_Model"), row.get("All_Models_Evaluated")])),
            MODEL_RULES,
        )
        raw = {
            field: value
            for field in source_fields
            if (value := row.get(field, "")) and value.strip()
        }

        studies.append({
            "study_id": doc_id,
            "first_author": first_author(row.get("First_Author_Year"), doc_id),
            "year": year,
            "title": clean(row.get("Title")),
            "journal": clean(row.get("Journal_Source")),
            "doi": clean(row.get("DOI")),
            "pmid": clean(row.get("PMID")),
            "countries_all": country_list,
            "country": country_list[0] if country_list else None,
            "who_regions": split_semicolon(row.get("WHO_Region")),
            "income": clean(row.get("Income_Classification")),
            "designs": split_semicolon(row.get("Study_Design")),
            "setting": clean(row.get("Study_Setting")),
            "multicentre": tri_bool(row.get("Multicentre_Reported")),
            "sample_size": clean(row.get("Sample_Size")),
            "ai_application_types": split_semicolon(row.get("AI_Application_Type")),
            "task_types": split_semicolon(row.get("Task_Type")),
            "ai_purpose": clean(row.get("AI_Purpose")),
            "data_types": split_semicolon(row.get("Data_Types_Used")),
            "pathogens": pathogens,
            "pathogens_reported": clean(row.get("Pathogens")),
            "pathogen_classification": clean(row.get("Pathogen_Classification")),
            "drug_classes": drug_classes,
            "resistance_type": clean(row.get("Resistance_Phenotype_Reported")),
            "models": models,
            "best_model": clean(row.get("Best_Performing_Model")),
            "validation": clean(row.get("Validation_Strategy")),
            "external_validation": tri_bool(row.get("External_Validation")),
            "prospective": tri_bool(row.get("Prospective_Evaluation")),
            "auroc": parse_metric(row.get("AUROC_Value")),
            "auroc_reported": tri_bool(row.get("AUROC_Reported")),
            "accuracy": parse_metric(row.get("Accuracy_Value")),
            "maturity_level": maturity(row.get("Clinical_Maturity_Level")),
            "maturity_label": clean(row.get("Clinical_Maturity_Level")),
            "interpretability_addressed": tri_bool(row.get("Interpretability_Addressed")),
            "code_available": tri_bool(row.get("Code_Shared")),
            "data_available": tri_bool(row.get("Data_Shared")),
            "reporting_guideline": clean(row.get("Reporting_Guideline")),
            "equity_discussed": tri_bool(row.get("Equity_Discussed")),
            "bias_tested": tri_bool(row.get("Algorithmic_Bias_Tested")),
            "calibration_assessed": tri_bool(row.get("Calibration_Assessed")),
            "generalisability_discussed": tri_bool(row.get("Generalisability_Discussed")),
            "subgroup_analysis": tri_bool(row.get("Subgroup_Analysis_Reported")),
            "clinical_impact_measured": tri_bool(row.get("Clinical_Impact_Measured")),
            "regulatory_approval": tri_bool(row.get("Regulatory_Approval_Mentioned")),
            "field_coverage": len(raw),
            "raw": raw,
        })

    years = [study["year"] for study in studies if study["year"]]
    metadata = {
        "study_count": len(studies),
        "source_field_count": len(source_fields),
        "year_min": min(years) if years else None,
        "year_max": max(years) if years else None,
        "source": "extraction_run/collated.csv",
        "source_columns": source_fields,
    }
    return {"metadata": metadata, "studies": studies}


def validate(payload: dict) -> None:
    studies = payload["studies"]
    assert len(studies) == 348, f"Expected 348 studies, got {len(studies)}"
    assert len({study["study_id"] for study in studies}) == len(studies), "Duplicate study IDs"
    assert payload["metadata"]["source_field_count"] == 215
    assert all(len(study["raw"]) <= 215 for study in studies)
    assert all(study["auroc"] is None or 0 <= study["auroc"] <= 1 for study in studies)


def main() -> None:
    payload = build()
    validate(payload)
    OUT_JSON.parent.mkdir(parents=True, exist_ok=True)
    OUT_JSON.write_text(json.dumps(payload, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    if SOURCE.resolve() != OUT_CSV.resolve():
        shutil.copyfile(SOURCE, OUT_CSV)
    print(json.dumps({
        "json": str(OUT_JSON),
        "csv": str(OUT_CSV),
        "studies": payload["metadata"]["study_count"],
        "fields": payload["metadata"]["source_field_count"],
        "json_bytes": OUT_JSON.stat().st_size,
    }))


if __name__ == "__main__":
    main()
