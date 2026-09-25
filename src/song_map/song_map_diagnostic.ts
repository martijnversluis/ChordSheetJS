export type SongMapDiagnosticType =
  'ambiguous_label' |
  'inferred_token' |
  'missing_recall_target' |
  'ordinal_conflict';

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
