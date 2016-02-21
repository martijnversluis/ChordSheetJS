export default class ParserState {
  constructor(name, callback) {
    this.name = name;
    this.conditions = [];
    this.conditionCount = 0;
    callback.call(this);
  }

  on(condition, callback) {
    conditionObj = new ParserCondition(condition, callback)
    this.conditions[this.conditionCount++] = conditionObj
  }

  ignore(conditions) {
    for (const i = 0, length = arguments.length; i < length; i++) {
      this.on(condition, () => {});
    }
  }

  else(callback) {
    this.on(ELSE, callback)
  }
}

class ParserCondition {
  constructor(condition, callback) {
    this.condition = condition;
    this.callback = callback;
  }
}
