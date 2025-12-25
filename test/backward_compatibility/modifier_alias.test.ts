import Chord from '../../src/chord';
import ChordLyricsPair from '../../src/chord_sheet/chord_lyrics_pair';
import Key from '../../src/key';
import Song from '../../src/chord_sheet/song';

import { FLAT, SHARP, SYMBOL } from '../../src/constants';

describe('Backward compatibility for modifier -> accidental rename', () => {
  describe('Key', () => {
    describe('#modifier getter', () => {
      it('returns the accidental value', () => {
        const key = Key.parse('C#');
        expect(key?.modifier).toEqual(SHARP);
      });

      it('returns null when no accidental', () => {
        const key = Key.parse('C');
        expect(key?.modifier).toBeNull();
      });
    });

    describe('#preferredModifier getter', () => {
      it('returns the preferredAccidental value', () => {
        const key = Key.parse('C#');
        expect(key?.preferredModifier).toEqual(SHARP);
      });
    });

    describe('#unicodeModifier getter', () => {
      it('returns the unicodeAccidental value for sharp', () => {
        const key = Key.parse('C#');
        expect(key?.unicodeModifier).toEqual('\u266f');
      });

      it('returns the unicodeAccidental value for flat', () => {
        const key = Key.parse('Bb');
        expect(key?.unicodeModifier).toEqual('\u266d');
      });
    });

    describe('#useModifier', () => {
      it('delegates to useAccidental', () => {
        const key = Key.parse('C');
        const modifiedKey = key?.useModifier(SHARP);
        expect(modifiedKey?.accidental).toEqual(SHARP);
      });
    });

    describe('.keyWithModifier', () => {
      it('delegates to keyWithAccidental', () => {
        const result = Key.keyWithModifier('C', SHARP, SYMBOL);
        expect(result).toEqual('C#');
      });
    });
  });

  describe('Chord', () => {
    describe('#useModifier', () => {
      it('delegates to useAccidental', () => {
        const chord = Chord.parse('C');
        const modifiedChord = chord?.useModifier(SHARP);
        expect(modifiedChord?.root?.accidental).toEqual(SHARP);
      });
    });
  });

  describe('ChordLyricsPair', () => {
    describe('#useModifier', () => {
      it('delegates to useAccidental', () => {
        const pair = new ChordLyricsPair('C', 'lyrics');
        const modifiedPair = pair.useModifier(FLAT);
        expect(modifiedPair.chords).toEqual('C');
      });
    });
  });

  describe('Song', () => {
    describe('#useModifier', () => {
      it('delegates to useAccidental', () => {
        const song = new Song();
        const modifiedSong = song.useModifier(SHARP);
        expect(modifiedSong).toBeInstanceOf(Song);
      });
    });
  });
});
