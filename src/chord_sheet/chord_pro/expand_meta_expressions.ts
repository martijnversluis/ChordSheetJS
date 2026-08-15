import Composite from './composite';
import Evaluatable from './evaluatable';
import Literal from './literal';
import Metadata from '../metadata';
import Ternary from './ternary';

import { parse } from '../../parser/chord_pro/peg_parser';

type SerializedPart = string | SerializedTernary;

interface SerializedTernary {
  type: 'ternary';
  variable?: string | null;
  valueTest?: string | null;
  trueExpression?: SerializedPart[];
  falseExpression?: SerializedPart[];
}

function buildEvaluatable(part: SerializedPart): Evaluatable {
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
 * Expands `%{...}` meta expressions inside a directive value (like a title or comment) by
 * evaluating them against the supplied metadata. Literal text is preserved verbatim.
 * @param {string} value The raw directive value, possibly containing `%{...}` expressions
 * @param {Metadata} metadata The metadata to evaluate the expressions against
 * @param {string} metadataSeparator The separator used to join multi-value metadata
 * @returns {string} The value with all meta expressions expanded
 */
export default function expandMetaExpressions(
  value: string,
  metadata: Metadata,
  metadataSeparator: string,
): string {
  if (!value.includes('%{')) {
    return value;
  }

  let parts: SerializedPart[];

  try {
    parts = parse(value, { startRule: 'MetaValue' }) as SerializedPart[];
  } catch {
    // If the value cannot be parsed as a meta value (for example a multiline value set
    // programmatically), leave it untouched rather than failing to render.
    return value;
  }

  const expression = new Composite(parts.map(buildEvaluatable));
  return expression.evaluate(metadata, metadataSeparator);
}
