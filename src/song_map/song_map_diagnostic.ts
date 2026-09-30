export type SongMapDiagnosticType =
  'ambiguous_label' |
  'ambiguous_reference' |
  'ambiguous_repeat' |
  'empty_map' |
  'inferred_token' |
  'invalid_reference' |
  'invalid_repeat' |
  'missing_recall_target' |
  'ordinal_conflict' |
  'unsupported_flow_item';

export interface SongMapDiagnosticProperties {
  type: SongMapDiagnosticType;
  message: string;
  lineNumber?: number | null;
  sectionToken?: string | null;
}

/**
 * Reports an issue that {@link SongMapGenerator} encountered while generating a {@link SongMap}
 */
class SongMapDiagnostic {
  type: SongMapDiagnosticType;

  message: string;

  lineNumber: number | null;

  sectionToken: string | null;

  constructor({
    type, message, lineNumber = null, sectionToken = null,
  }: SongMapDiagnosticProperties) {
    this.type = type;
    this.message = message;
    this.lineNumber = lineNumber;
    this.sectionToken = sectionToken;
  }

  toString(): string {
    return `${this.type}: ${this.message}`;
  }
}

export default SongMapDiagnostic;
