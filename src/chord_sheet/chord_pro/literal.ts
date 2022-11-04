import Evaluatable from './evaluatable';

class Literal extends Evaluatable {
  string: string;

  constructor(expression: string) {
    super();
    this.string = expression;
  }

  evaluate(): string {
    return this.string;
  }

  isRenderable(): boolean {
    return true;
  }

  clone(): Literal {
    return new Literal(this.string);
  }
}

export default Literal;
