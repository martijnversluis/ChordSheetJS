class Literal {
  constructor(expression) {
    this.string = expression;
  }

  evaluate() {
    return this.string;
  }
}

export default Literal;
