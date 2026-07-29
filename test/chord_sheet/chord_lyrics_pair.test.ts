import {
  ChordLineTokenClassification,
  ChordLyricsPair,
  chordLineStyleRole,
} from '../../src';

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

  describe('#styleRole', () => {
    it('styles a mute rhythm symbol like a no-chord marker without changing its token semantics', () => {
      const pair = new ChordLyricsPair('x', '');

      expect(pair.tokenKind).toBe('rhythm-symbol');
      expect(pair.tokenVariant).toBe('mute');
      expect(pair.styleRole).toBe('noChord');
    });

    it.each(['/', '-'])('keeps %s in the rhythm-symbol style role', (symbol) => {
      expect(new ChordLyricsPair(symbol, '').styleRole).toBe('rhythmSymbol');
    });

    it('infers the mute variant for existing two-argument role resolution calls', () => {
      expect(chordLineStyleRole('rhythm-symbol', 'x')).toBe('noChord');
      expect(chordLineStyleRole('rhythm-symbol', 'x', null)).toBe('rhythmSymbol');
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

    it('does not carry the derived rhythm flag when chord content changes', () => {
      const rhythmSymbol = new ChordLyricsPair('/', '');
      const chord = rhythmSymbol.set({ chords: 'D' });

      expect(chord.classification).toEqual({ kind: 'chord', variant: null });
      expect(chord.isRhythmSymbol).toBe(false);
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
