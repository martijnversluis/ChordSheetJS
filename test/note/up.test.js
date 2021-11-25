import Note from '../../src/note';

describe('Note', () => {
  describe('#up', () => {
    describe('note chord letters', () => {
      const notes = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'A'];

      for (let i = 0; i < 7; i += 1) {
        const from = notes[i];
        const to = notes[i + 1];

        it(`converts ${from} to ${to}`, () => {
          expect(new Note(from).up().note).toEqual(to);
        });
      }
    });

    describe('chord numbers', () => {
      const notes = [1, 2, 3, 4, 5, 6, 7, 1];

      for (let i = 0; i < 7; i += 1) {
        const from = notes[i];
        const to = notes[i + 1];

        it(`converts ${from} to ${to}`, () => {
          expect(new Note(from).up().note).toEqual(to);
        });
      }
    });
  });
});
