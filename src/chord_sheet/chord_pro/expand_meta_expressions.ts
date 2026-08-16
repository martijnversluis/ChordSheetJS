import Metadata from '../metadata';
import parseMetaValue from './parse_meta_value';

/**
 * Expands `%{...}` meta expressions inside a directive value (like a comment or section label) by
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
  const expression = parseMetaValue(value);

  if (!expression) {
    return value;
  }

  return expression.evaluate(metadata, metadataSeparator);
}
