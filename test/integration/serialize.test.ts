import { ChordSheetSerializer } from '../../src';
import song from '../fixtures/song';
import serializedSong from '../fixtures/serialized_song';

describe('serializing a song', () => {
  it('serializes a song object', () => {
    expect(new ChordSheetSerializer().serialize(song)).toEqual(serializedSong);
  });

  it('deserializes a song object', () => {
    expect(new ChordSheetSerializer().deserialize(serializedSong)).toEqual(song);
  });
});
