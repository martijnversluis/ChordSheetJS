import Note from '../../src/note';

describe('Note', () => {
  describe('#change', () => {
    describe('note chord letters', () => {
      const octave = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
      const notes = [...octave, ...octave, ...octave];
      const start = octave.length;

      for (let i = 0; i < 7; i += 1) {
        for (let delta = -7; delta <= 7; delta += 1) {
          const from = notes[start + i];
          const to = notes[start + delta + i];

          it(`converts ${from} with delta ${delta} to ${to}`, () => {
            expect(new Note(from).change(delta).note).toEqual(to);
          });
        }
      }
    });

    describe('chord numbers', () => {
      const octave = [1, 2, 3, 4, 5, 6, 7];
      const notes = [...octave, ...octave, ...octave];
      const start = octave.length;

      for (let i = 0; i < 7; i += 1) {
        for (let delta = -7; delta <= 7; delta += 1) {
          const from = notes[start + i];
          const to = notes[start + delta + i];

          it(`converts ${from} with delta ${delta} to ${to}`, () => {
            expect(new Note(from).change(delta).note).toEqual(to);
          });
        }
      }
    });
  });
});
