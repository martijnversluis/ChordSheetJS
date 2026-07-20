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
});
