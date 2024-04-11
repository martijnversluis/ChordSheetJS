import Evaluatable from './evaluatable';

class Literal extends Evaluatable {
  string: string;

  constructor(string: string) {
    super();
    this.string = string;
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
