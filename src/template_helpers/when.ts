import WhenClause from './when_clause';
import WhenCallback from './when_callback';

class When {
  condition: boolean = false;

  clauses: WhenClause[] = [];

  constructor(condition: any, thenCallback?: WhenCallback) {
    this.add(condition, thenCallback);
  }

  then(thenCallback: WhenCallback): When {
    return this.add(this.condition, thenCallback);
  }

  elseWhen(condition: any, callback?: WhenCallback): When {
    return this.add(condition, callback);
  }

  else(callback: WhenCallback): When {
    return this.add(true, callback);
  }

  private add(condition: any, callback?: WhenCallback): When {
    this.condition = !!condition;

    if (callback) {
      this.clauses.push(new WhenClause(condition, callback));
    }

    return this;
  }

  toString(): string {
    const [firstClause, ...rest] = this.clauses;

    if (firstClause) {
      return firstClause.evaluate(rest);
    }

    throw new Error('Expected at least one .then() clause');
  }
}

export default When;
