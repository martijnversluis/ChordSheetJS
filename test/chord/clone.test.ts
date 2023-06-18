import Chord from '../../src/chord';

describe('Chord', () => {
  describe('numeral', () => {
    describe('clone', () => {
      it('assigns the right instance variables', () => {
        const chord = Chord.parseOrFail('bisus/#IV');

        const clonedChord = chord.clone();

        expect(clonedChord.suffix).toEqual(chord.suffix);
        expect(clonedChord.root).toEqual(chord.root);
        expect(clonedChord.root).not.toBe(chord.root);
        expect(clonedChord.bass).toEqual(chord.bass);
        expect(clonedChord.bass).not.toBe(chord.bass);
      });
    });
  });
});
