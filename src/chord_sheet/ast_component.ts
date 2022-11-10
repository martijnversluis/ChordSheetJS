import TraceInfo from './trace_info';

abstract class AstComponent {
  line: number | null = null;

  column: number | null = null;

  offset: number | null = null;

  protected constructor(traceInfo: TraceInfo | null = null) {
    if (traceInfo) {
      this.line = traceInfo.line || null;
      this.column = traceInfo.column || null;
      this.offset = traceInfo.offset || null;
    }
  }

  abstract clone(): AstComponent;
}

export default AstComponent;
