import WhenCallback from './when_callback';

class WhenClause {
  condition: boolean;

  callback: WhenCallback;

  constructor(condition: any, callback: WhenCallback) {
    this.condition = !!condition;
    this.callback = callback;
  }

  evaluate(otherClauses: WhenClause[]): string {
    if (this.condition) {
      return this.callback();
    }

    if (otherClauses.length > 0) {
      const [firstClause, ...rest] = otherClauses;
      return firstClause.evaluate(rest);
    }

    return '';
  }
}

export default WhenClause;
