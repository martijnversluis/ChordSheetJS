import '../util/matchers';

import { Chord, SYMBOL } from '../../src';

describe('Chord', () => {
  describe('chord symbol', () => {
    describe('German notation (H = B natural)', () => {
      describe('parse', () => {
        it('parses H as B natural (grade 11)', () => {
          const chord = Chord.parse('H');

          expect(chord).toMatchObject({
            root: {
              grade: 0,
              accidental: null,
              type: SYMBOL,
              minor: false,
              referenceKeyGrade: 11,
              originalKeyString: 'H',
              preferredNotation: 'german',
            },
          });
        });

        it('parses Hm as B minor', () => {
          const chord = Chord.parse('Hm');

          expect(chord).toMatchObject({
            root: {
              referenceKeyGrade: 11,
              minor: true,
              preferredNotation: 'german',
            },
            suffix: 'm',
          });
        });

        it('parses H7', () => {
          const chord = Chord.parse('H7');

          expect(chord?.toString()).toEqual('H7');
          expect(chord?.root?.effectiveGrade).toEqual(11);
        });

        it('parses Hsus4', () => {
          const chord = Chord.parse('Hsus4');

          expect(chord?.toString()).toEqual('Hsus4');
          expect(chord?.root?.effectiveGrade).toEqual(11);
        });

        it('parses a slash chord with H as bass', () => {
          const chord = Chord.parse('D/H');

          expect(chord?.toString()).toEqual('D/H');
          expect(chord?.bass?.effectiveGrade).toEqual(11);
        });

        it('parses a slash chord with H as root', () => {
          const chord = Chord.parse('H/D');

          expect(chord?.toString()).toEqual('H/D');
          expect(chord?.root?.effectiveGrade).toEqual(11);
        });

        it('still parses B as B natural (English notation, unchanged)', () => {
          const chord = Chord.parse('B');

          expect(chord?.toString()).toEqual('B');
          expect(chord?.root?.effectiveGrade).toEqual(11);
        });
      });

      describe('transpose', () => {
        it('transposes H up to C', () => {
          expect(Chord.parse('H')?.transposeUp().toString()).toEqual('C');
        });

        it('transposes H down to Bb', () => {
          expect(Chord.parse('H')?.transposeDown().toString()).toEqual('Bb');
        });

        it('transposes Hm up to Cm', () => {
          expect(Chord.parse('Hm')?.transposeUp().toString()).toEqual('Cm');
        });

        it('does not switch to H notation when transposing a non-H chord', () => {
          // A doesn't use H, so result is B (English default)
          expect(Chord.parse('A')?.transpose(2).toString()).toEqual('B');
        });

        it('preserves H notation when transposing by full octave', () => {
          expect(Chord.parse('H')?.transpose(12).toString()).toEqual('H');
        });

        it('transposes a slash chord with H bass', () => {
          expect(Chord.parse('D/H')?.transposeUp().toString()).toEqual('D#/C');
        });
      });

      describe('normalize', () => {
        it('keeps H as H after normalize', () => {
          expect(Chord.parse('H')?.normalize().toString()).toEqual('H');
        });

        it('keeps Hm as Hm after normalize', () => {
          expect(Chord.parse('Hm')?.normalize().toString()).toEqual('Hm');
        });

        it('normalizes enharmonic bass note for H-rooted minor chord', () => {
          // Mirrors existing Bm/A# -> Bm/Bb behaviour; H notation should not break the lookup
          expect(Chord.parse('Hm/A#')?.normalize().toString()).toEqual('Hm/Bb');
        });
      });
    });

    describe('strict German notation (notation: \'german\')', () => {
      const opts = { notation: 'german' as const };

      it('parses B as B flat (grade 10) and renders as B', () => {
        const chord = Chord.parse('B', opts);

        expect(chord?.root?.effectiveGrade).toEqual(10);
        expect(chord?.toString()).toEqual('B');
      });

      it('parses Bm as B-flat minor and renders as Bm', () => {
        const chord = Chord.parse('Bm', opts);

        expect(chord?.root?.effectiveGrade).toEqual(10);
        expect(chord?.toString()).toEqual('Bm');
      });

      it('still parses H as B natural', () => {
        const chord = Chord.parse('H', opts);

        expect(chord?.root?.effectiveGrade).toEqual(11);
        expect(chord?.toString()).toEqual('H');
      });

      it('keeps Bb explicit as Bb', () => {
        expect(Chord.parse('Bb', opts)?.toString()).toEqual('Bb');
      });

      it('transposes B up by 1 to H', () => {
        expect(Chord.parse('B', opts)?.transposeUp().toString()).toEqual('H');
      });

      it('transposes H up by 1 to C', () => {
        expect(Chord.parse('H', opts)?.transposeUp().toString()).toEqual('C');
      });

      it('renders bass note in German style too', () => {
        expect(Chord.parse('D/B', opts)?.toString()).toEqual('D/B');
        expect(Chord.parse('D/B', opts)?.root?.effectiveGrade).toEqual(2);
        expect(Chord.parse('D/B', opts)?.bass?.effectiveGrade).toEqual(10);
      });
    });
  });
});
