const KNOWN_TAGS = 'b|i|u|s|tt|big|small|sub|sup|span|strut|sym';

const PANGO_TAG_PATTERN = new RegExp(
  `<(?:\\/(?:${KNOWN_TAGS})>|(?:${KNOWN_TAGS})(?:\\s[^>]*)?\\/?>)`,
  'g',
);

const SYM_MAP: Record<string, string> = {
  sharp: '\u266F',
  flat: '\u266D',
  natural: '\u266E',
};

const SPAN_ATTR_TO_CSS: Record<string, string> = {
  color: 'color',
  foreground: 'color',
  background: 'background-color',
  font_family: 'font-family',
  face: 'font-family',
  size: 'font-size',
  weight: 'font-weight',
  style: 'font-style',
};

const PASSTHROUGH_TAGS = new Set(['b', 'i', 'u', 's', 'tt', 'sub', 'sup']);

const CONVERTED_TAGS: Record<string, string> = {
  big: 'font-size: larger',
  small: 'font-size: smaller',
};

// Matches open, close, and self-closing known Pango tags in a single pass
const PANGO_HTML_PATTERN = new RegExp(
  `<(${KNOWN_TAGS})(\\s[^>]*)?\\/>` +
  `|<(${KNOWN_TAGS})(\\s[^>]*)?>` +
  `|<\\/(${KNOWN_TAGS})>`,
  'g',
);

function parseAttributes(attrString: string): Record<string, string> {
  const attrs: Record<string, string> = {};
  const attrRegex = /(\w+)\s*=\s*"([^"]*)"/g;
  let result = attrRegex.exec(attrString);

  while (result !== null) {
    const [, key, value] = result;
    attrs[key] = value;
    result = attrRegex.exec(attrString);
  }

  return attrs;
}

function spanAttrsToCss(attrs: Record<string, string>): string[] {
  const properties = Object.entries(SPAN_ATTR_TO_CSS)
    .filter(([pangoAttr]) => attrs[pangoAttr])
    .map(([pangoAttr, cssProperty]) => `${cssProperty}: ${attrs[pangoAttr]}`);

  if (attrs.underline && attrs.underline !== 'none') {
    properties.push('text-decoration: underline');
  }

  if (attrs.strikethrough === 'true') {
    properties.push('text-decoration: line-through');
  }

  return properties;
}

function convertSpanOpen(attrString: string): string {
  const attrs = parseAttributes(attrString);

  if (attrs.href) return `<a href="${attrs.href}">`;

  const cssProperties = spanAttrsToCss(attrs);

  if (cssProperties.length > 0) {
    return `<span style="${cssProperties.join('; ')}">`;
  }

  return '<span>';
}

function handleSelfClosing(tag: string, attrString: string): string {
  if (tag === 'sym') {
    const attrs = parseAttributes(attrString || '');
    return SYM_MAP[attrs.name] || '';
  }
  return '';
}

function handleOpenTag(tag: string, attrString: string, stack: string[]): string | null {
  if (PASSTHROUGH_TAGS.has(tag)) {
    stack.push(`</${tag}>`);
    return `<${tag}>`;
  }

  if (CONVERTED_TAGS[tag]) {
    stack.push('</span>');
    return `<span style="${CONVERTED_TAGS[tag]}">`;
  }

  if (tag === 'span') {
    const html = convertSpanOpen(attrString || '');
    stack.push(html.startsWith('<a ') ? '</a>' : '</span>');
    return html;
  }

  return null;
}

function handleCloseTag(tag: string, stack: string[]): string | null {
  if (PASSTHROUGH_TAGS.has(tag)) {
    stack.pop();
    return `</${tag}>`;
  }

  if (tag === 'big' || tag === 'small' || tag === 'span') {
    return stack.pop() || `</${tag}>`;
  }

  return null;
}

export function stripPangoMarkup(text: string): string {
  return text.replace(PANGO_TAG_PATTERN, '');
}

export function pangoToHtml(text: string): string {
  const openTagStack: string[] = [];

  return text.replace(
    PANGO_HTML_PATTERN,
    (match, scTag, scAttrs, openTag, openAttrs, closeTag) => {
      if (scTag) return handleSelfClosing(scTag, scAttrs);
      if (openTag) return handleOpenTag(openTag, openAttrs, openTagStack) ?? match;
      if (closeTag) return handleCloseTag(closeTag, openTagStack) ?? match;
      return match;
    },
  );
}
