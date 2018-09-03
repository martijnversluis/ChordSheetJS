import { expect } from 'chai';

import Song from '../../src/chord_sheet/song';
import LineStub from '../cloneable_stub';
import { createSong } from '../utilities';

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

    expect(song.title).to.eq('Song title');
  });

  it('can have a subtitle', () => {
    const song = new Song({ subtitle: 'Song subtitle' });

    expect(song.subtitle).to.eq('Song subtitle');
  });

  it('can have an artist', () => {
    const song = new Song({ artist: 'Song artist' });

    expect(song.artist).to.eq('Song artist');
  });

  it('can have a composer', () => {
    const song = new Song({ composer: 'Song composer' });

    expect(song.composer).to.eq('Song composer');
  });

  it('can have a lyricist', () => {
    const song = new Song({ lyricist: 'Song lyricist' });

    expect(song.lyricist).to.eq('Song lyricist');
  });

  it('can have a copyright', () => {
    const song = new Song({ copyright: 'Song copyright' });

    expect(song.copyright).to.eq('Song copyright');
  });

  it('can have an album', () => {
    const song = new Song({ album: 'Song album' });

    expect(song.album).to.eq('Song album');
  });

  it('can have a year', () => {
    const song = new Song({ year: 'Song year' });

    expect(song.year).to.eq('Song year');
  });

  it('can have a key', () => {
    const song = new Song({ key: 'Song key' });

    expect(song.key).to.eq('Song key');
  });

  it('can have a time', () => {
    const song = new Song({ time: 'Song time' });

    expect(song.time).to.eq('Song time');
  });

  it('can have a tempo', () => {
    const song = new Song({ tempo: 'Song tempo' });

    expect(song.tempo).to.eq('Song tempo');
  });

  it('can have a duration', () => {
    const song = new Song({ duration: 'Song duration' });

    expect(song.duration).to.eq('Song duration');
  });

  it('can have a capo', () => {
    const song = new Song({ capo: 'Song capo' });

    expect(song.capo).to.eq('Song capo');
  });

  describe('#clone', () => {
    it('returns a clone of the song', () => {
      const song = new Song();
      song.lines = ['foo', 'bar'].map(value => new LineStub(value));
      song.assignMetaData({ foo: 'bar' });
      const clonedSong = song.clone();

      const actualValues = clonedSong.lines.map(line => line.value);
      expect(actualValues).to.eql(['foo', 'bar']);
      expect(clonedSong.metaData).to.eql({ foo: 'bar' });
    });
  });

  describe('#bodyLines', () => {
    it('returns the lines excluding leading non-renderable lines', () => {
      const nonRenderableLine1 = createLineStub({ renderable: false });
      const nonRenderableLine2 = createLineStub({ renderable: false });
      const renderableLine1 = createLineStub({ renderable: true });
      const nonRenderableLine3 = createLineStub({ renderable: false });
      const song = createSong([nonRenderableLine1, nonRenderableLine2, renderableLine1, nonRenderableLine3]);

      expect(song.bodyLines).to.eql([renderableLine1, nonRenderableLine3]);
    });
  });
});
