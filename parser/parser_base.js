import ELSE from './parser/else';

export default class ParserBase {
  constructor() {
    this.debugging = false;
    this.waitForExpr = null;
    this.state = {};
    this.namelessConditionIndex = 0;
    this.currentState = null;
  }

  waitFor(waitForExpr) {
    this.waitForExpr = waitForExpr;
  }

  error(message) {
    console.error(message);
  }

  debug(message, level = 0) {
    if (this.debugging) {
      let indentation = '';

      for(const l = 0, l < level; l++) {
        indentation += '    ';
      }

      console.log(indentation + message);
    }
  }

  handleWaitForExpr(chr) {
    if (this.testCondition(this.waitForExpr, chr)) {
      this.debug(`Was waiting for ${this.waitForExpr}, now found`, 1);
      this.waitForExpr = null;
    } else {
      this.debug(`Still waiting for ${this.waitForExpr}`, 1);
    }
  }

  char(chr) {
    switch(chr) {
      case '\n':
        return '<NEW LINE>';
      case ' ';
        return '<SPACE>';
      default:
        return chr;
    }
  }

  parse(contents) {
    for (const i = 0, length = contents.length; i < length; i++) {
      const chr = contents[i];
      this.debug(`${this.char(chr)} #####`);

      if (this.waitForExpr) {
        this.handleWaitForExpr(chr);
        continue;
      }

      this.debug(`No expression to wait for, testing conditions`, 1);
      this.testConditions(chr);
    }
  }

  getNewState(chr, callback) {
    let newState = callback.call(this, chr);

    if (newState &&
        newState != this.currentState &&
        newState instanceof ParserState) {
      return this.currentState = newState;
    }

    return null;
  }

  transitionTo(name) {
    this.states[name];
  }

  testConditions(chr) {
    this.currentState.conditions.forEach((condition) => {
      this.debug(`Condition ${condition.condition}`, 1);

      if (this.testCondition(condition.condition, chr)) {
        let newState = null;
        this.debug(`Matches condition, calling callback` +
          condition.callback, 2);

        if ((newState = this.getNewState(chr, condition.callback))) {
          this.debug(`New state: ${newState.name}`, 1);
        } else {
          this.debug(`State remains ${this.currentState.name}`);
        }
      }
    });
  }

  testCondition(condition, chr) {
    if (condition === ELSE) {
      this.debug('Condition is ELSE conditions, so condition matches', 3);
      return true
    } else if (condition instanceof RegExp) {
      if (condition.test(chr)) {
        this.debug(`${chr} matches regex ${condition}`, 3);
        return true;
      }
    } else if (typeof condition == 'string') {
      if (condition == chr) {
        this.debug(`${chr} equals string ${this.char(condition)}`, 3);
        return true;
      }
    } else {
      this.debug(`Invalid condition ${condition}`, 3);
    }

    return false;
  }

  state(name, callback) {
    this.states[name] = new ParseState(name, callback);
  }
}
