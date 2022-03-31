import {
  Metadata,
  Ternary,
  Literal,
} from '../../../src';

describe('Ternary', () => {
  describe('#evaluate', () => {
    it('evaluates a simple variable lookup', () => {
      const ternary = new Ternary({ variable: 'composer' });
      const metadata = new Metadata({ composer: 'John' });

      expect(ternary.evaluate(metadata)).toEqual('John');
    });

    it('evaluates with a true expression and a present variable', () => {
      const ternary = new Ternary({ variable: 'composer', trueExpression: [new Literal('Composer is present')] });
      const metadata = new Metadata({ composer: 'John' });

      expect(ternary.evaluate(metadata)).toEqual('Composer is present');
    });

    it('evaluates with a true expression and an absent variable', () => {
      const ternary = new Ternary({ variable: 'composer', trueExpression: [new Literal('Composer is present')] });
      const metadata = new Metadata();

      expect(ternary.evaluate(metadata)).toEqual('');
    });

    it('evaluates with a true expression and a truthy value test', () => {
      const ternary = new Ternary({
        variable: 'composer',
        valueTest: 'John',
        trueExpression: [new Literal('Composer is John')],
      });

      const metadata = new Metadata({ composer: 'John' });

      expect(ternary.evaluate(metadata)).toEqual('Composer is John');
    });

    it('evaluates with a true expression and a falsy value test', () => {
      const ternary = new Ternary({
        variable: 'composer',
        valueTest: 'Mary',
        trueExpression: [new Literal('Composer is John')],
      });

      const metadata = new Metadata({ composer: 'John' });

      expect(ternary.evaluate(metadata)).toEqual('');
    });

    it('evaluates with both a true expression and false expression and a present variable', () => {
      const ternary = new Ternary({
        variable: 'composer',
        trueExpression: [new Literal('Composer is present')],
        falseExpression: [new Literal('Composer is absent')],
      });

      const metadata = new Metadata({ composer: 'John' });

      expect(ternary.evaluate(metadata)).toEqual('Composer is present');
    });

    it('evaluates with both a true expression and false expression and an absent variable', () => {
      const ternary = new Ternary({
        variable: 'composer',
        trueExpression: [new Literal('Composer is present')],
        falseExpression: [new Literal('Composer is absent')],
      });

      const metadata = new Metadata();

      expect(ternary.evaluate(metadata)).toEqual('Composer is absent');
    });

    it('evaluates with both a true expression and false expression and a truthy value test', () => {
      const ternary = new Ternary({
        variable: 'composer',
        valueTest: 'John',
        trueExpression: [new Literal('Composer is John')],
        falseExpression: [new Literal('Composer is not John')],
      });

      const metadata = new Metadata({ composer: 'John' });

      expect(ternary.evaluate(metadata)).toEqual('Composer is John');
    });

    it('evaluates with both a true expression and false expression and a falsy value test', () => {
      const ternary = new Ternary({
        variable: 'composer',
        valueTest: 'Mary',
        trueExpression: [new Literal('Composer is John')],
        falseExpression: [new Literal('Composer is not John')],
      });

      const metadata = new Metadata({ composer: 'John' });

      expect(ternary.evaluate(metadata)).toEqual('Composer is not John');
    });

    it('evaluates an empty expression with an upper context', () => {
      const ternary = new Ternary();
      const metadata = new Metadata({ composer: 'John' });

      expect(ternary.evaluate(metadata, null, 'composer')).toEqual('John');
    });

    it('evaluates a nested ternary via upper context', () => {
      const ternary = new Ternary({
        variable: 'composer',
        trueExpression: [
          new Ternary({ }),
        ],
      });

      const metadata = new Metadata({ composer: 'John' });

      expect(ternary.evaluate(metadata)).toEqual('John');
    });

    it('raises on an empty expression without a upper context', () => {
      const ternary = new Ternary({ line: 3, column: 20 });
      const metadata = new Metadata({ composer: 'John' });

      expect(() => ternary.evaluate(metadata)).toThrow('Unexpected empty expression on line 3 column 20');
    });
  });
});
