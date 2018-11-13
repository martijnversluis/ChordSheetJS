import { expect } from 'chai';

import ChordProExpression from '../../src/parser/chord_pro_expression';
import Metadata from '../../src/chord_sheet/metadata';

describe('ChordProExpression', () => {
  it('allows to use single metadata values in lyrics', () => {
    const metadata = new Metadata({ x_word_type: 'wisdom' });
    const expression = new ChordProExpression('x_word_type', metadata, {});

    expect(expression).to.evaluateTo('wisdom');
  });

  it('allows to use multiple metadata values in lyrics', () => {
    const metadata = new Metadata({ composer: ['John', 'Jane'] });
    const expression = new ChordProExpression('composer', metadata, {});

    expect(expression).to.evaluateTo('John,Jane');
  });

  it('allows to use a single value of a metadata list in lyrics', () => {
    const metadata = new Metadata({ composer: ['John', 'Jane'] });
    const expression = new ChordProExpression('composer.2', metadata, {});

    expect(expression).to.evaluateTo('Jane');
  });

  it('allows to set the separator for multiple metadata values in lyrics', () => {
    const metadata = new Metadata({ composer: ['John', 'Jane'] });
    const settings = { 'metadata.separator': '/' };
    const expression = new ChordProExpression('composer', metadata, settings);

    expect(expression).to.evaluateTo('John/Jane');
  });

  it('allows to specify a true text for present values', () => {
    const metadata = new Metadata({ composer: 'John' });
    const expression = new ChordProExpression('composer|composer specified', metadata, {});

    expect(expression).to.evaluateTo('composer specified');
  });

  it('allows to specify a true text for absent values', () => {
    const metadata = new Metadata({});
    const expression = new ChordProExpression('composer|composer specified', metadata, {});

    expect(expression).to.evaluateTo('');
  });

  it('allows to specify a false text for present values', () => {
    const metadata = new Metadata({ composer: 'John' });
    const expression = new ChordProExpression('composer|composer specified|not specified', metadata, {});

    expect(expression).to.evaluateTo('composer specified');
  });

  it('allows to specify a false text for absent values', () => {
    const metadata = new Metadata({});
    const expression = new ChordProExpression('composer|composer specified|not specified', metadata, {});

    expect(expression).to.evaluateTo('not specified');
  });

  it('allows nested expressions for present values', () => {
    const metadata = new Metadata({ composer: 'John', artist: 'Elvis' });
    const expression = new ChordProExpression('composer|Composer: %{composer}|not specified', metadata, {});

    expect(expression).to.evaluateTo('Composer: John');
  });

  it('allows nested expressions for absent values', () => {
    const metadata = new Metadata({ artist: 'Elvis' });
    const expression = new ChordProExpression('composer|Composer: %{composer}|Artist: %{artist}', metadata, {});

    expect(expression).to.evaluateTo('Artist: Elvis');
  });

  it('allows an empty nested expression to refer to the controlling item', () => {
    const metadata = new Metadata({ composer: 'John' });
    const expression = new ChordProExpression('composer|Composer: %{}|not specified', metadata, {});

    expect(expression).to.evaluateTo('Composer: John');
  });

  it('respects escaped characters', () => {
    const metadata = new Metadata({ composer: 'John' });
    const expression = new ChordProExpression('composer|Composer \\\\\\|\\}\\a|not specified', metadata, {});

    expect(expression).to.evaluateTo('Composer \\|}\\a');
  });

  it('raises an error when referring to non-existent metadata', () => {
    const metadata = new Metadata({});
    const expression = new ChordProExpression('x_some_value', metadata, {});

    expect(() => expression.evaluate()).to.throw(/unknown.+metadata.+x_some_value/i);
  });
});
