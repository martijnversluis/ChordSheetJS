import { BACK_SLASH, CURLY_END, CURLY_START, PERCENT, PIPE } from '../constants';
import Metadata from '../chord_sheet/metadata';

const ESCAPED_CHARACTERS = [CURLY_START, CURLY_END, BACK_SLASH, PIPE];

export class ExpressionError extends Error {
  constructor(message, column) {
    super(message);
    this.name = 'ExpressionError';
    this.column = column;
  }
}

class CompositeExpression {
  constructor() {
    this.components = [];
  }

  addComponent(ComponentClass) {
    const component = new ComponentClass();
    component.parent = this;
    this.components.push(component);
    return component;
  }

  evaluate() {
    return this.components.map(component => component.evaluate()).join('');
  }

  get ternary() {
    return this.parent.ternary;
  }

  get settings() {
    return this.parent.settings;
  }

  get metadata() {
    return this.parent.metadata;
  }
}

class LiteralExpression {
  constructor() {
    this.expression = '';
  }

  read(chr) {
    this.expression += chr;
  }

  evaluate() {
    return this.expression;
  }

  get ternary() {
    return this.parent.ternary;
  }

  get settings() {
    return this.parent.settings;
  }

  get metadata() {
    return this.parent.metadata;
  }
}

class TernaryExpression {
  constructor() {
    this.controllingItemExpression = null;
    this.trueExpression = null;
    this.falseExpression = null;
  }

  addControllingItemExpression() {
    this.controllingItemExpression = new LiteralExpression();
    this.controllingItemExpression.parent = this;
    return this.controllingItemExpression;
  }

  addTrueExpression() {
    this.trueExpression = new CompositeExpression();
    this.trueExpression.parent = this;
    return this.trueExpression;
  }

  addFalseExpression() {
    this.falseExpression = new CompositeExpression();
    this.falseExpression.parent = this;
    return this.falseExpression;
  }

  evaluate() {
    const controllingItemName = this.getControllingItemName();
    const controllingItem = this.getMetadata(controllingItemName);

    if (controllingItem.length) {
      return this.evaluatePresentControllingItem(controllingItem);
    }

    return this.evaluateAbsentControllingItem(controllingItemName);
  }

  getControllingItemName() {
    let controllingItemName = this.controllingItemExpression.evaluate();

    if (controllingItemName === '') {
      controllingItemName = this.parent.ternary.controllingItemExpression.evaluate();
    }

    return controllingItemName;
  }

  evaluatePresentControllingItem(controllingItem) {
    if (this.trueExpression) {
      return this.trueExpression.evaluate();
    }

    return controllingItem;
  }

  evaluateAbsentControllingItem(controllingItemName) {
    if (this.falseExpression) {
      return this.falseExpression.evaluate();
    }

    if (this.trueExpression) {
      return '';
    }

    throw new ExpressionError(`Unknown metadata '${controllingItemName}'`);
  }

  getMetadata(key) {
    const value = this.metadata[key];

    if (!value) {
      return '';
    }

    const { constructor } = value;

    if (constructor && constructor.name === 'Array') {
      return value.join(this.getMetadataSeparator());
    }

    return `${value}`;
  }

  getMetadataSeparator() {
    return this.settings['metadata.separator'] || ',';
  }

  get ternary() {
    return this;
  }

  get settings() {
    return this.parent.settings;
  }

  get metadata() {
    return this.parent.metadata;
  }
}

class ChordProExpression {
  constructor(expression, metadata = new Metadata(), settings = {}) {
    this.expression = expression;
    this.metadata = metadata.getExtended();
    this.settings = settings;

    this.root = new TernaryExpression();
    this.root.parent = this;
    this.currentComponent = this.addNextTernaryExpressionComponent(this.root);
  }

  evaluate() {
    this.parseExpression(this.expression);

    try {
      return this.root.evaluate();
    } catch (error) {
      throw this.supplementError(error);
    }
  }

  supplementError(error) {
    if (error.name === 'ExpressionError') {
      return new ExpressionError(error.message, this.column);
    }

    return error;
  }

  parseExpression(expression) {
    this.column = 0;

    for (const count = expression.length; this.column < count; this.column += 1) {
      this.read(expression[this.column], expression[this.column + 1]);
    }
  }

  skipNext() {
    this.column += 1;
  }

  read(chr, nextChr) {
    if (chr === BACK_SLASH) {
      this.readBackSlash(chr, nextChr);
    } else if (chr === PIPE) {
      this.readPipe();
    } else if (chr === PERCENT) {
      this.readPercent(chr, nextChr);
    } else if (chr === CURLY_END) {
      this.readExpressionEnd();
    } else {
      this.readLiteral(chr);
    }
  }

  readBackSlash(chr, nextChr) {
    if (ESCAPED_CHARACTERS.indexOf(nextChr) === -1) {
      this.currentComponent.read(chr);
    }

    this.currentComponent.read(nextChr);
    this.skipNext();
  }

  readPipe() {
    this.currentComponent = this.addNextTernaryExpressionComponent(this.currentComponent.ternary);
  }

  readPercent(chr, nextChr) {
    if (nextChr === CURLY_START) {
      this.readExpressionStart();
    } else {
      this.readLiteral(chr);
    }
  }

  readExpressionStart() {
    const ternaryExpression = this.currentComponent.parent.addComponent(TernaryExpression);
    this.currentComponent = ternaryExpression.addControllingItemExpression();
    this.skipNext();
  }

  readExpressionEnd() {
    this.currentComponent = this.currentComponent.ternary.parent.addComponent(LiteralExpression);
  }

  readLiteral(chr) {
    this.currentComponent.read(chr);
  }

  addNextTernaryExpressionComponent(ternaryExpression) {
    const { controllingItemExpression, trueExpression, falseExpression } = ternaryExpression;

    if (controllingItemExpression === null) {
      return ternaryExpression.addControllingItemExpression();
    } else if (trueExpression === null) {
      return ternaryExpression.addTrueExpression().addComponent(LiteralExpression);
    } else if (falseExpression === null) {
      return ternaryExpression.addFalseExpression().addComponent(LiteralExpression);
    }

    throw new ExpressionError('Unexpected \'|\', expected end of ternary expression', this.column);
  }
}

export default ChordProExpression;
