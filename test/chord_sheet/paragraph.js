import { expect } from 'chai';

import { createLine, createParagraph } from '../utilities';
import { CHORUS, INDETERMINATE, VERSE } from '../../src/constants';

describe('Paragraph', () => {
  describe('#type', () => {
    context('when all line types are equal or none', () => {
      it('returns the common type', () => {
        const paragraph = createParagraph([
          createLine([], NONE),
          createLine([], VERSE),
          createLine([], VERSE),
          createLine([], NONE),
        ]);

        expect(paragraph.type).to.equal(VERSE);
      });
    });

    context('when the line types vary', () => {
      it('returns indeterminate', () => {
        const paragraph = createParagraph([
          createLine([], NONE),
          createLine([], VERSE),
          createLine([], VERSE),
          createLine([], CHORUS),
        ]);

        expect(paragraph.type).to.equal(INDETERMINATE);
      });
    });
  });
});
