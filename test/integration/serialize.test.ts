import { ChordLyricsPair, ChordSheetSerializer, SerializedSong } from '../../src';
import { exampleSongSolfege, exampleSongSymbol } from '../fixtures/song';
import { serializedSongSolfege, serializedSongSymbol } from '../fixtures/serialized_song';

describe('serializing a song', () => {
  it('serializes a symbol song object', () => {
    expect(new ChordSheetSerializer().serialize(exampleSongSymbol)).toEqual(serializedSongSymbol);
  });

  it('deserializes a symbol song object', () => {
    expect(new ChordSheetSerializer().deserialize(serializedSongSymbol)).toEqual(exampleSongSymbol);
  });

  it('serializes a solfege song object', () => {
    expect(new ChordSheetSerializer().serialize(exampleSongSolfege)).toEqual(serializedSongSolfege);
  });

  it('deserializes a solfege song object', () => {
    expect(new ChordSheetSerializer().deserialize(serializedSongSolfege)).toEqual(exampleSongSolfege);
  });

  it('infers token kinds from serialized songs without token fields', () => {
    const serializedSong: SerializedSong = {
      type: 'chordSheet',
      lines: [{
        type: 'line',
        items: ['/', '|', ':||', '(6x)', 'N.C.'].map((chords) => ({
          type: 'chordLyricsPair', chords, lyrics: '',
        })),
      }],
    };

    const song = new ChordSheetSerializer().deserialize(serializedSong);
    const pairs = song.lines[0].items as ChordLyricsPair[];

    expect(pairs.map((pair) => pair.tokenKind)).toEqual([
      'rhythm-symbol', 'barline', 'barline', 'instruction', 'no-chord',
    ]);
  });

  it('serializes explicit token classifications when they differ from inference', () => {
    const pair = new ChordLyricsPair('C', '', '', null, false, 'instruction', 'repeat-count');

    expect(new ChordSheetSerializer().serializeChordLyricsPair(pair)).toMatchObject({
      chords: 'C',
      tokenKind: 'instruction',
      tokenVariant: 'repeat-count',
    });
  });

  it('preserves an explicit null token variant', () => {
    const serializer = new ChordSheetSerializer();
    const pair = new ChordLyricsPair('/', '', '', null, true, 'rhythm-symbol', null);
    const serializedPair = serializer.serializeChordLyricsPair(pair);
    const serializedSong: SerializedSong = {
      type: 'chordSheet',
      lines: [{ type: 'line', items: [serializedPair] }],
    };

    const restored = serializer.deserialize(serializedSong).lines[0].items[0] as ChordLyricsPair;

    expect(serializedPair.tokenVariant).toBeNull();
    expect(restored.tokenVariant).toBeNull();
  });
});
