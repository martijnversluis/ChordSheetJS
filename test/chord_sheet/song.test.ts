import {
  Song,
  ChordSheetSerializer, ChordLyricsPair, Tag,
} from '../../src';

import { createSong } from '../utilities';
import exampleSong from '../fixtures/song';
import serializedSong from '../fixtures/serialized_song.json';
import serializedChangedSong from '../fixtures/changed_song.json';

const createLineStub = ({ renderable }) => (
  {
    hasRenderableItems() {
      return renderable;
    },

    hasContent() {
      return renderable;
    },

    isEmpty() {
      return false;
    },
  }
);

describe('Song', () => {
  it('can have a title', () => {
    const song = new Song({ title: 'Song title' });

    expect(song.title).toEqual('Song title');
  });

  it('can have a subtitle', () => {
    const song = new Song({ subtitle: 'Song subtitle' });

    expect(song.subtitle).toEqual('Song subtitle');
  });

  it('can have an artist', () => {
    const song = new Song({ artist: 'Song artist' });

    expect(song.artist).toEqual('Song artist');
  });

  it('can have a composer', () => {
    const song = new Song({ composer: 'Song composer' });

    expect(song.composer).toEqual('Song composer');
  });

  it('can have a lyricist', () => {
    const song = new Song({ lyricist: 'Song lyricist' });

    expect(song.lyricist).toEqual('Song lyricist');
  });

  it('can have a copyright', () => {
    const song = new Song({ copyright: 'Song copyright' });

    expect(song.copyright).toEqual('Song copyright');
  });

  it('can have an album', () => {
    const song = new Song({ album: 'Song album' });

    expect(song.album).toEqual('Song album');
  });

  it('can have a year', () => {
    const song = new Song({ year: 'Song year' });

    expect(song.year).toEqual('Song year');
  });

  it('can have a key', () => {
    const song = new Song({ key: 'Song key' });

    expect(song.key).toEqual('Song key');
  });

  it('can have a time', () => {
    const song = new Song({ time: 'Song time' });

    expect(song.time).toEqual('Song time');
  });

  it('can have a tempo', () => {
    const song = new Song({ tempo: 'Song tempo' });

    expect(song.tempo).toEqual('Song tempo');
  });

  it('can have a duration', () => {
    const song = new Song({ duration: 'Song duration' });

    expect(song.duration).toEqual('Song duration');
  });

  it('can have a capo', () => {
    const song = new Song({ capo: 'Song capo' });

    expect(song.capo).toEqual('Song capo');
  });

  describe('#clone', () => {
    it('returns a clone of the song', () => {
      const serializedExampleSong = new ChordSheetSerializer().serialize(exampleSong);
      const clone = exampleSong.clone();
      const serializedClone = new ChordSheetSerializer().serialize(clone);
      expect(serializedClone).toEqual(serializedExampleSong);
    });
  });

  describe('#bodyLines', () => {
    it('returns the lines excluding leading non-renderable lines', () => {
      const nonRenderableLine1 = createLineStub({ renderable: false });
      const nonRenderableLine2 = createLineStub({ renderable: false });
      const renderableLine1 = createLineStub({ renderable: true });
      const nonRenderableLine3 = createLineStub({ renderable: false });
      const song = createSong([nonRenderableLine1, nonRenderableLine2, renderableLine1, nonRenderableLine3]);

      expect(song.bodyLines).toEqual([renderableLine1, nonRenderableLine3]);
    });
  });

  describe('#mapLines', () => {
    it('changes the song', () => {
      const song = exampleSong.clone();
      expect(song.paragraphs.map((p) => p.lines.length)).toEqual([0, 1, 2, 2]);

      const changedSong = song.mapLines((line) => (
        line.mapItems((item) => {
          if (item instanceof ChordLyricsPair) {
            return item.transpose(2, 'D').setLyrics(item.lyrics.toUpperCase());
          }

          if (item instanceof Tag) {
            return item.setValue(`${item.value} changed`);
          }

          return item;
        })
      ));

      expect(new ChordSheetSerializer().serialize(changedSong)).toEqual(serializedChangedSong);
      expect(changedSong.title).toEqual('Let it be changed');
      expect(changedSong.subtitle).toEqual('ChordSheetJS example version changed');
      expect(changedSong.key).toEqual('C changed');
      expect(changedSong.composer).toEqual(['John Lennon changed', 'Paul McCartney changed']);
      expect(changedSong.paragraphs.length).toEqual(song.paragraphs.length);
      expect(changedSong.paragraphs.map((p) => p.lines.length)).toEqual([0, 1, 2, 2]);
    });
  });

  describe('#mapItems', () => {
    it('changes the song', () => {
      const song = exampleSong.clone();
      expect(song.paragraphs.map((p) => p.lines.length)).toEqual([0, 1, 2, 2]);

      const changedSong = song.mapItems((item) => {
        if (item instanceof ChordLyricsPair) {
          return item.transpose(2, 'D').setLyrics(item.lyrics.toUpperCase());
        }

        if (item instanceof Tag) {
          return item.setValue(`${item.value} changed`);
        }

        return item;
      });

      expect(new ChordSheetSerializer().serialize(changedSong)).toEqual(serializedChangedSong);
      expect(changedSong.title).toEqual('Let it be changed');
      expect(changedSong.subtitle).toEqual('ChordSheetJS example version changed');
      expect(changedSong.key).toEqual('C changed');
      expect(changedSong.composer).toEqual(['John Lennon changed', 'Paul McCartney changed']);
      expect(changedSong.paragraphs.length).toEqual(song.paragraphs.length);
      expect(changedSong.paragraphs.map((p) => p.lines.length)).toEqual([0, 1, 2, 2]);
    });
  });

  it('can be serialized', () => {
    expect(new ChordSheetSerializer().serialize(exampleSong)).toEqual(serializedSong);
  });

  it('can be deserialized', () => {
    expect(new ChordSheetSerializer().deserialize(serializedSong)).toEqual(exampleSong);
  });
});
