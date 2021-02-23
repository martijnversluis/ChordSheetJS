class Composite {
  constructor(expressions, variable = null) {
    this.expressions = expressions;
    this.variable = variable;
  }

  evaluate(metadata) {
    return this.expressions.map((expression) => (
      expression.evaluate(metadata, this.variable)
    )).join('');
  }
}

export default Composite;
