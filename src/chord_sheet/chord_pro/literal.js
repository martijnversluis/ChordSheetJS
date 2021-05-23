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
}

export default Literal;
