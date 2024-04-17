import { ChordSheetSerializer } from '../../src';
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
});
