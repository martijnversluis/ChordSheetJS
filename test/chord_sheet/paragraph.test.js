import { createLine, createParagraph } from '../utilities';
import { CHORUS, INDETERMINATE, VERSE } from '../../src/constants';

describe('Paragraph', () => {
  describe('#type', () => {
    describe('when all line types are equal or none', () => {
      it('returns the common type', () => {
        const paragraph = createParagraph([
          createLine([], VERSE),
          createLine([], VERSE),
        ]);

        expect(paragraph.type).toEqual(VERSE);
      });
    });

    describe('when the line types vary', () => {
      it('returns indeterminate', () => {
        const paragraph = createParagraph([
          createLine([], VERSE),
          createLine([], CHORUS),
        ]);

        expect(paragraph.type).toEqual(INDETERMINATE);
      });
    });
  });
});
