export interface WhenCallback {
  (): string;
}

class When {
  condition: boolean = false;

  thenCallback: WhenCallback | null = null;

  elseCallback: WhenCallback | null = null;

  constructor(condition: any, thenCallback: WhenCallback | null = null) {
    this.condition = !!condition;
    this.thenCallback = thenCallback;
  }

  then(thenCallback: WhenCallback): When {
    this.thenCallback = thenCallback;
    return this;
  }

  else(elseCallback: WhenCallback): When {
    this.elseCallback = elseCallback;
    return this;
  }

  toString(): string {
    if (this.condition) {
      return this.thenCallback ? this.thenCallback() : '';
    }

    return this.elseCallback ? this.elseCallback() : '';
  }
}

export default When;
