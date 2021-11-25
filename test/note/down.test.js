import Note from '../../src/note';

describe('Note', () => {
  describe('#down', () => {
    describe('note chord letters', () => {
      const notes = ['G', 'F', 'E', 'D', 'C', 'B', 'A', 'G'];

      for (let i = 0; i < 7; i += 1) {
        const from = notes[i];
        const to = notes[i + 1];

        it(`converts ${from} to ${to}`, () => {
          expect(new Note(from).down().note).toEqual(to);
        });
      }
    });

    describe('chord numbers', () => {
      const notes = [7, 6, 5, 4, 3, 2, 1, 7];

      for (let i = 0; i < 7; i += 1) {
        const from = notes[i];
        const to = notes[i + 1];

        it(`converts ${from} to ${to}`, () => {
          expect(new Note(from).down().note).toEqual(to);
        });
      }
    });
  });
});
