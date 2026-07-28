import HtmlElementStyler from '../../src/rendering/html/html_element_styler';

import { PositionedElement } from '../../src/rendering/renderer';

function chordElement(content: string): PositionedElement {
  return {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    content,
    type: 'chord',
    style: { weight: 700 },
    page: 1,
    column: 1,
  };
}

describe('HtmlElementStyler', () => {
  it.each(['/', '|', '||', ':||', '(6x)', 'D2'])(
    'does not override the resolved font weight for %s',
    (content) => {
      const styler = new HtmlElementStyler({});

      expect(styler.chordStyles(chordElement(content)).fontWeight).toBeUndefined();
    },
  );

  it.each([
    ['normal', 'normal', 'normal'],
    ['bold', 'bold', 'normal'],
    ['italic', 'normal', 'italic'],
    ['oblique', 'normal', 'oblique'],
    ['bolditalic', 'bold', 'italic'],
  ])('maps the %s font face to explicit CSS weight and style', (style, weight, fontStyle) => {
    const styler = new HtmlElementStyler({});
    const element = { style: {} };

    styler.applyFontStyle(element, {
      color: 'black', name: 'Test', size: 12, style,
    });

    expect(element.style).toMatchObject({ fontWeight: weight, fontStyle });
  });
});
