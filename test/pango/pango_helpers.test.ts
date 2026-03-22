import { pangoToHtml, stripPangoMarkup } from '../../src/pango/pango_helpers';

describe('stripPangoMarkup', () => {
  it('returns plain text unchanged', () => {
    expect(stripPangoMarkup('hello world')).toBe('hello world');
  });

  it('returns empty string for empty input', () => {
    expect(stripPangoMarkup('')).toBe('');
  });

  it('strips <b> tags', () => {
    expect(stripPangoMarkup('<b>bold</b>')).toBe('bold');
  });

  it('strips <i> tags', () => {
    expect(stripPangoMarkup('<i>italic</i>')).toBe('italic');
  });

  it('strips <u> tags', () => {
    expect(stripPangoMarkup('<u>underline</u>')).toBe('underline');
  });

  it('strips <s> tags', () => {
    expect(stripPangoMarkup('<s>strike</s>')).toBe('strike');
  });

  it('strips <tt> tags', () => {
    expect(stripPangoMarkup('<tt>mono</tt>')).toBe('mono');
  });

  it('strips <big> tags', () => {
    expect(stripPangoMarkup('<big>large</big>')).toBe('large');
  });

  it('strips <small> tags', () => {
    expect(stripPangoMarkup('<small>tiny</small>')).toBe('tiny');
  });

  it('strips <sub> tags', () => {
    expect(stripPangoMarkup('<sub>sub</sub>')).toBe('sub');
  });

  it('strips <sup> tags', () => {
    expect(stripPangoMarkup('<sup>sup</sup>')).toBe('sup');
  });

  it('strips <span> tags with attributes', () => {
    expect(stripPangoMarkup('<span color="red">red text</span>')).toBe('red text');
  });

  it('strips nested tags', () => {
    expect(stripPangoMarkup('<b><i>bold italic</i></b>')).toBe('bold italic');
  });

  it('strips self-closing <strut/> tags', () => {
    expect(stripPangoMarkup('before<strut/>after')).toBe('beforeafter');
  });

  it('strips self-closing <sym/> tags', () => {
    expect(stripPangoMarkup('C<sym name="sharp"/>m')).toBe('Cm');
  });

  it('handles mixed markup and plain text', () => {
    expect(stripPangoMarkup('Roses are <span color="red">red</span>, <b>bold</b> move'))
      .toBe('Roses are red, bold move');
  });

  it('leaves unknown tags as-is', () => {
    expect(stripPangoMarkup('<div>content</div>')).toBe('<div>content</div>');
  });

  it('leaves angle brackets that are not tags as-is', () => {
    expect(stripPangoMarkup('a < b > c')).toBe('a < b > c');
  });
});

describe('pangoToHtml', () => {
  it('returns plain text unchanged', () => {
    expect(pangoToHtml('hello world')).toBe('hello world');
  });

  it('returns empty string for empty input', () => {
    expect(pangoToHtml('')).toBe('');
  });

  // Pass-through tags (already valid HTML)
  it('passes through <b> tags', () => {
    expect(pangoToHtml('<b>bold</b>')).toBe('<b>bold</b>');
  });

  it('passes through <i> tags', () => {
    expect(pangoToHtml('<i>italic</i>')).toBe('<i>italic</i>');
  });

  it('passes through <u> tags', () => {
    expect(pangoToHtml('<u>underline</u>')).toBe('<u>underline</u>');
  });

  it('passes through <s> tags', () => {
    expect(pangoToHtml('<s>strike</s>')).toBe('<s>strike</s>');
  });

  it('passes through <tt> tags', () => {
    expect(pangoToHtml('<tt>mono</tt>')).toBe('<tt>mono</tt>');
  });

  it('passes through <sub> tags', () => {
    expect(pangoToHtml('<sub>sub</sub>')).toBe('<sub>sub</sub>');
  });

  it('passes through <sup> tags', () => {
    expect(pangoToHtml('<sup>sup</sup>')).toBe('<sup>sup</sup>');
  });

  // Conversion tags
  it('converts <big> to <span style="font-size: larger">', () => {
    expect(pangoToHtml('<big>large</big>')).toBe('<span style="font-size: larger">large</span>');
  });

  it('converts <small> to <span style="font-size: smaller">', () => {
    expect(pangoToHtml('<small>tiny</small>')).toBe('<span style="font-size: smaller">tiny</span>');
  });

  // <span> attribute conversions
  it('converts span color attribute to CSS color', () => {
    expect(pangoToHtml('<span color="red">text</span>'))
      .toBe('<span style="color: red">text</span>');
  });

  it('converts span foreground attribute to CSS color', () => {
    expect(pangoToHtml('<span foreground="blue">text</span>'))
      .toBe('<span style="color: blue">text</span>');
  });

  it('converts span background attribute to CSS background-color', () => {
    expect(pangoToHtml('<span background="#ff0000">text</span>'))
      .toBe('<span style="background-color: #ff0000">text</span>');
  });

  it('converts span font_family attribute to CSS font-family', () => {
    expect(pangoToHtml('<span font_family="Arial">text</span>'))
      .toBe('<span style="font-family: Arial">text</span>');
  });

  it('converts span face attribute to CSS font-family', () => {
    expect(pangoToHtml('<span face="Courier">text</span>'))
      .toBe('<span style="font-family: Courier">text</span>');
  });

  it('converts span size attribute to CSS font-size', () => {
    expect(pangoToHtml('<span size="large">text</span>'))
      .toBe('<span style="font-size: large">text</span>');
  });

  it('converts span weight attribute to CSS font-weight', () => {
    expect(pangoToHtml('<span weight="bold">text</span>'))
      .toBe('<span style="font-weight: bold">text</span>');
  });

  it('converts span style attribute to CSS font-style', () => {
    expect(pangoToHtml('<span style="italic">text</span>'))
      .toBe('<span style="font-style: italic">text</span>');
  });

  it('converts span underline="single" to text-decoration: underline', () => {
    expect(pangoToHtml('<span underline="single">text</span>'))
      .toBe('<span style="text-decoration: underline">text</span>');
  });

  it('converts span strikethrough="true" to text-decoration: line-through', () => {
    expect(pangoToHtml('<span strikethrough="true">text</span>'))
      .toBe('<span style="text-decoration: line-through">text</span>');
  });

  it('converts multiple span attributes to multiple CSS properties', () => {
    expect(pangoToHtml('<span color="red" weight="bold">text</span>'))
      .toBe('<span style="color: red; font-weight: bold">text</span>');
  });

  it('converts span href to anchor tag', () => {
    expect(pangoToHtml('<span href="https://example.com">link</span>'))
      .toBe('<a href="https://example.com">link</a>');
  });

  // <sym> conversions
  it('converts <sym name="sharp"/> to Unicode sharp', () => {
    expect(pangoToHtml('<sym name="sharp"/>')).toBe('\u266F');
  });

  it('converts <sym name="flat"/> to Unicode flat', () => {
    expect(pangoToHtml('<sym name="flat"/>')).toBe('\u266D');
  });

  it('converts <sym name="natural"/> to Unicode natural', () => {
    expect(pangoToHtml('<sym name="natural"/>')).toBe('\u266E');
  });

  it('leaves unknown sym names as empty string', () => {
    expect(pangoToHtml('<sym name="unknown"/>')).toBe('');
  });

  // <strut/> handling
  it('removes strut tags', () => {
    expect(pangoToHtml('before<strut/>after')).toBe('beforeafter');
  });

  // Nested tags
  it('handles nested tags', () => {
    expect(pangoToHtml('<b><i>bold italic</i></b>')).toBe('<b><i>bold italic</i></b>');
  });

  // Mixed content
  it('handles mixed markup and plain text', () => {
    expect(pangoToHtml('Roses are <span color="red">red</span>, <b>bold</b>'))
      .toBe('Roses are <span style="color: red">red</span>, <b>bold</b>');
  });

  // Unknown tags
  it('leaves unknown tags as-is', () => {
    expect(pangoToHtml('<div>content</div>')).toBe('<div>content</div>');
  });

  it('leaves angle brackets that are not tags as-is', () => {
    expect(pangoToHtml('a < b > c')).toBe('a < b > c');
  });
});
