import Note from '../../src/note';

describe('Note', () => {
  describe('#down', () => {
    describe('note chord letters', () => {
      const notes = ['G', 'F', 'E', 'D', 'C', 'B', 'A', 'G'];

      for (let i = 0; i < 7; i += 1) {
        const from = notes[i];
        const to = notes[i + 1];

        it(`converts ${from} to ${to}`, () => {
          expect(Note.parse(from).down().note).toEqual(to);
        });
      }
    });

    describe('chord numbers', () => {
      const notes = [7, 6, 5, 4, 3, 2, 1, 7];

      for (let i = 0; i < 7; i += 1) {
        const from = notes[i];
        const to = notes[i + 1];

        it(`converts ${from} to ${to}`, () => {
          expect(Note.parse(from).down().note).toEqual(to);
        });
      }
    });

    describe('major numerals', () => {
      const notes = ['VII', 'VI', 'V', 'IV', 'III', 'II', 'I', 'VII'];

      for (let i = 0; i < 7; i += 1) {
        const from = notes[i];
        const to = notes[i + 1];

        it(`converts ${from} to ${to}`, () => {
          expect(Note.parse(from).down().note).toEqual(to);
        });
      }
    });

    describe('minor numerals', () => {
      const notes = ['vii', 'vi', 'v', 'iv', 'iii', 'ii', 'i', 'vii'];

      for (let i = 0; i < 7; i += 1) {
        const from = notes[i];
        const to = notes[i + 1];

        it(`converts ${from} to ${to}`, () => {
          expect(Note.parse(from).down().note).toEqual(to);
        });
      }
    });
  });
});
