import Composite from './composite';
import Evaluatable from './evaluatable';
import Literal from './literal';
import Ternary from './ternary';

import { parse } from '../../parser/chord_pro/peg_parser';
import { SerializedComposite, SerializedLiteral, SerializedTernary } from '../../serialized_types';

function buildEvaluatable(part: SerializedLiteral | SerializedTernary): Evaluatable {
  if (typeof part === 'string') {
    return new Literal(part);
  }

  return new Ternary({
    variable: part.variable,
    valueTest: part.valueTest,
    trueExpression: (part.trueExpression || []).map(buildEvaluatable),
    falseExpression: (part.falseExpression || []).map(buildEvaluatable),
  });
}

/**
 * Parses a directive value into an evaluatable expression, so that any `%{...}` meta expressions it
 * contains can be evaluated against metadata. Returns `null` when the value contains no meta
 * expressions, or cannot be parsed as a meta value (for example a multiline value).
 * @param {string} value The raw directive value
 * @returns {Composite | null} The parsed expression, or `null` when there is nothing to evaluate
 */
export default function parseMetaValue(value: string): Composite | null {
  if (!value.includes('%{')) {
    return null;
  }

  let parts: SerializedComposite;

  try {
    parts = parse(value, { startRule: 'MetaValue' }) as SerializedComposite;
  } catch {
    return null;
  }

  return new Composite(parts.map(buildEvaluatable));
}
