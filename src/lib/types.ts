export interface DatasetMetadata {
  study_count: number;
  source_field_count: number;
  year_min: number | null;
  year_max: number | null;
  source: string;
  source_columns: string[];
}

export interface Dataset {
  metadata: DatasetMetadata;
  studies: Study[];
}

export interface Study {
  study_id: string;
  first_author: string | null;
  year: number | null;
  title: string | null;
  journal: string | null;
  doi: string | null;
  pmid: string | null;
  country: string | null;
  countries_all: string[];
  who_regions: string[];
  income: string | null;
  designs: string[];
  setting: string | null;
  multicentre: boolean | null;
  sample_size: string | null;
  ai_application_types: string[];
  task_types: string[];
  ai_purpose: string | null;
  data_types: string[];
  pathogens: string[];
  pathogens_reported: string | null;
  pathogen_classification: string | null;
  drug_classes: string[];
  resistance_type: string | null;
  models: string[];
  best_model: string | null;
  validation: string | null;
  external_validation: boolean | null;
  prospective: boolean | null;
  auroc: number | null;
  auroc_reported: boolean | null;
  accuracy: number | null;
  maturity_level: number | null;
  maturity_label: string | null;
  interpretability_addressed: boolean | null;
  code_available: boolean | null;
  data_available: boolean | null;
  reporting_guideline: string | null;
  equity_discussed: boolean | null;
  bias_tested: boolean | null;
  calibration_assessed: boolean | null;
  generalisability_discussed: boolean | null;
  subgroup_analysis: boolean | null;
  clinical_impact_measured: boolean | null;
  regulatory_approval: boolean | null;
  field_coverage: number;
  raw: Record<string, string>;
}
