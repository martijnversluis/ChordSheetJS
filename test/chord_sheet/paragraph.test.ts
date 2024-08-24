import { CHORUS, INDETERMINATE, VERSE } from '../../src';
import {
  createLine, createLiteral, createParagraph, createTag,
} from '../utilities';

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

  describe('#isLiteral', () => {
    describe('when all content lines are literal', () => {
      it('returns true', () => {
        const paragraph = createParagraph([
          createLine([
            createTag('start_of_tab'),
          ]),
          createLine([
            createLiteral('Tab line 1'),
          ]),
          createLine([
            createLiteral('Tab line 2'),
          ]),
          createLine([
            createTag('end_of_tab'),
          ]),
        ]);

        expect(paragraph.isLiteral()).toBe(true);
      });
    });

    describe('when not all lines are literal', () => {
      it('returns false', () => {
        const paragraph = createParagraph([
          createLine([
            createTag('start_of_tab'),
          ]),
          createLine([
            createLiteral('Tab line 1'),
          ]),
          createLine([
            createTag('comment', 'This is a comment'),
          ]),
          createLine([
            createTag('end_of_tab'),
          ]),
        ]);

        expect(paragraph.isLiteral()).toBe(false);
      });
    });

    describe('when the paragraph is empty', () => {
      it('returns false', () => {
        const paragraph = createParagraph([]);

        expect(paragraph.isLiteral()).toBe(false);
      });
    });
  });

  describe('#contents', () => {
    it('returns the paragraph contents as a string', () => {
      const paragraph = createParagraph([
        createLine([
          createTag('start_of_tab'),
        ]),
        createLine([
          createLiteral('Tab line 1'),
        ]),
        createLine([
          createLiteral('Tab line 2'),
        ]),
        createLine([
          createTag('end_of_tab'),
        ]),
      ]);

      expect(paragraph.contents).toEqual('Tab line 1\nTab line 2');
    });
  });

  describe('#label', () => {
    describe('when the first line has a section delimiter', () => {
      it('returns the value of the section delimiter', () => {
        const paragraph = createParagraph([
          createLine([
            createTag('start_of_tab', 'Tab section'),
          ]),
          createLine([
            createTag('tab'),
          ]),
          createLine([
            createTag('end_of_tab'),
          ]),
        ]);

        expect(paragraph.label).toEqual('Tab section');
      });
    });

    describe('when the first line does not have a section delimiter', () => {
      it('returns null', () => {
        const paragraph = createParagraph([
          createLine([
            createLiteral('Tab line 1'),
          ]),
          createLine([
            createLiteral('Tab line 2'),
          ]),
        ]);

        expect(paragraph.label).toBeNull();
      });
    });
  });

  describe('#isEmpty', () => {
    describe('when the paragraph is empty', () => {
      it('returns true', () => {
        const paragraph = createParagraph([]);

        expect(paragraph.isEmpty()).toBe(true);
      });
    });

    describe('when the paragraph is not empty', () => {
      it('returns false', () => {
        const paragraph = createParagraph([
          createLine([
            createLiteral('Tab line 1'),
          ]),
        ]);

        expect(paragraph.isEmpty()).toBe(false);
      });
    });
  });
});
