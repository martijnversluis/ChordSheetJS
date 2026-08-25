import Chord from '../../src/chord';
import Key from '../../src/key';

describe('Chord', () => {
  describe('chord symbol', () => {
    describe('toChordSolfege', () => {
      // Symbol and solfege are both absolute representations, so the resulting
      // solfege name must honor the written spelling regardless of reference key.
      // See https://github.com/martijnversluis/ChordSheetJS/issues/2285
      const symbolToSolfege: Record<string, string> = {
        'C#': 'Do#',
        'D#': 'Re#',
        'F#': 'Fa#',
        'G#': 'Sol#',
        'A#': 'La#',
        'Bb': 'Sib',
        'Eb': 'Mib',
      };

      ['C', 'E', 'Bb', 'F#'].forEach((referenceKey) => {
        Object.entries(symbolToSolfege).forEach(([symbol, solfege]) => {
          it(`converts ${symbol} to ${solfege} with reference key ${referenceKey}`, () => {
            const chord = Chord.parse(symbol)!;
            expect(chord.toChordSolfegeString(Key.wrap(referenceKey))).toEqual(solfege);
          });
        });
      });

      it('converts the bass note as well', () => {
        const chord = Chord.parse('A/C#')!;
        expect(chord.toChordSolfegeString(Key.wrap('E'))).toEqual('La/Do#');
      });
    });
  });
});
