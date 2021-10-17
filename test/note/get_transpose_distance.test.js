import Note from '../../src/note';

describe('Note', () => {
  describe('#getTransposeDistance', () => {
    describe('for numbers', () => {
      const transposeDistances = {
        1: 0,
        2: 2,
        3: 4,
        4: 5,
        5: 7,
        6: 9,
        7: 11,
      };

      Object.keys(transposeDistances).forEach((chordNumber) => {
        const distance = transposeDistances[chordNumber];

        describe(`for chord ${chordNumber}`, () => {
          it(`returns ${distance}`, () => {
            expect(new Note(chordNumber).getTransposeDistance()).toEqual(distance);
          });
        });
      });
    });
  });
});
