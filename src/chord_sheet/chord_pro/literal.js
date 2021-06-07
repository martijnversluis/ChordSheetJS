class Literal {
  constructor(expression) {
    this.string = expression;
  }

  evaluate() {
    return this.string;
  }

  isRenderable() {
    return true;
  }

  clone() {
    return new Literal(this.string);
  }
}

export default Literal;
