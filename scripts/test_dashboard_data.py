#!/usr/bin/env python3

import csv
import json
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
EXTERNAL_SOURCE = ROOT.parent / "extraction_run" / "collated.csv"
SOURCE = EXTERNAL_SOURCE if EXTERNAL_SOURCE.exists() else ROOT / "public" / "data" / "collated.csv"
OUTPUT = ROOT / "public" / "data" / "amr_ai_collated.json"


class DashboardDataTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        with SOURCE.open(newline="", encoding="utf-8-sig") as handle:
            cls.rows = list(csv.DictReader(handle))
        cls.payload = json.loads(OUTPUT.read_text(encoding="utf-8"))
        cls.studies = cls.payload["studies"]

    def test_expected_shape(self):
        self.assertEqual(len(self.rows), len(self.studies))
        self.assertEqual(215, self.payload["metadata"]["source_field_count"])

    def test_ids_match_source_in_order(self):
        self.assertEqual(
            [row["doc_id"] for row in self.rows],
            [study["study_id"] for study in self.studies],
        )

    def test_ids_are_unique(self):
        ids = [study["study_id"] for study in self.studies]
        self.assertEqual(len(ids), len(set(ids)))

    def test_populated_raw_values_are_preserved(self):
        by_id = {study["study_id"]: study for study in self.studies}
        for row in self.rows:
            raw = by_id[row["doc_id"]]["raw"]
            for field, value in row.items():
                if field == "doc_id" or not value.strip():
                    continue
                self.assertEqual(value, raw[field], f"Mismatch for {row['doc_id']} / {field}")

    def test_metrics_are_bounded(self):
        for study in self.studies:
            for field in ("auroc", "accuracy"):
                value = study[field]
                self.assertTrue(value is None or 0 <= value <= 1, (study["study_id"], field, value))


if __name__ == "__main__":
    unittest.main()
