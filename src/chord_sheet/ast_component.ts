import TraceInfo from './trace_info';

abstract class AstComponent {
  line?: number = null;

  column?: number = null;

  offset?: number = null;

  protected constructor(traceInfo: TraceInfo = null) {
    if (traceInfo) {
      this.line = traceInfo.line;
      this.column = traceInfo.column;
      this.offset = traceInfo.offset;
    }
  }

  abstract clone(): any;
}

export default AstComponent;
