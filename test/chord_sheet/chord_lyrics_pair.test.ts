import { ChordLineTokenClassification, ChordLyricsPair } from '../../src';

describe('ChordLyricsPair', () => {
  describe('#clone', () => {
    it('returns a clone of the chord lyrics pair', () => {
      const chordLyricsPair = new ChordLyricsPair('C', 'Let it');
      const clonedChordLyricsPair = chordLyricsPair.clone();

      expect(clonedChordLyricsPair.chords).toEqual('C');
      expect(clonedChordLyricsPair.lyrics).toEqual('Let it');
    });
  });

  describe('#isRenderable', () => {
    it('returns true', () => {
      const chordLyricsPair = new ChordLyricsPair();

      expect(chordLyricsPair.isRenderable()).toBe(true);
    });
  });

  describe('#transpose', () => {
    it('transposes and normalizes the chord', () => {
      const chordLyricsPair = new ChordLyricsPair('F', 'Let it');
      const transposedPair = chordLyricsPair.transpose(1, 'Db');

      expect(transposedPair.chords).toEqual('Gb');
    });

    it('can transpose without key', () => {
      const chordLyricsPair = new ChordLyricsPair('F', 'Let it');
      const transposedPair = chordLyricsPair.transpose(1);

      expect(transposedPair.chords).toEqual('F#');
    });

    it.each(['/', '|', ':||', '(6x)', 'N.C.'])('does not transpose non-chord token %s', (token) => {
      const pair = new ChordLyricsPair(token, '');

      expect(pair.transpose(2).chords).toBe(token);
      expect(pair.chord).toBeNull();
    });
  });

  describe('#hasLyrics', () => {
    it('returns true if there are lyrics', () => {
      const chordLyricsPair = new ChordLyricsPair('C', 'Let it');

      expect(chordLyricsPair.hasLyrics()).toBe(true);
    });

    it('returns false when the lyrics are falsy', () => {
      const chordLyricsPair = new ChordLyricsPair('C', '');

      expect(chordLyricsPair.hasLyrics()).toBe(false);
    });

    it('returns false when the lyrics are only whitespace', () => {
      const chordLyricsPair = new ChordLyricsPair('C', '   ');

      expect(chordLyricsPair.hasLyrics()).toBe(false);
    });
  });

  describe('#set', () => {
    it('reclassifies tokens when chord content changes', () => {
      const instruction = new ChordLyricsPair('(6x)', '');

      expect(instruction.set({ chords: 'D' }).tokenKind).toBe('chord');
    });

    it('preserves token classification when only lyrics change', () => {
      const instruction = new ChordLyricsPair('(6x)', '');

      expect(instruction.setLyrics('repeat').tokenKind).toBe('instruction');
    });

    it('accepts an atomic classification override', () => {
      const pair = new ChordLyricsPair('/', '', '', null, false, {
        kind: 'instruction',
        variant: null,
      });

      expect(pair.tokenKind).toBe('instruction');
      expect(pair.tokenVariant).toBeNull();
    });

    it('preserves an explicit null variant when updating a pair', () => {
      const rhythmSymbol = new ChordLyricsPair('/', '');

      expect(rhythmSymbol.set({
        classification: { kind: 'rhythm-symbol', variant: null },
      }).tokenVariant).toBeNull();
    });

    it('infers classification when an invalid runtime override is supplied', () => {
      const invalidClassification = {
        kind: 'chord',
        variant: 'repeat-count',
      } as unknown as ChordLineTokenClassification;

      const pair = new ChordLyricsPair('/', '', '', null, false, invalidClassification);

      expect(pair.classification).toEqual({ kind: 'rhythm-symbol', variant: 'continuation' });
    });
  });
});
