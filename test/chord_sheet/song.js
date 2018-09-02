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

  describe('#clone', () => {
    it('returns a clone of the song', () => {
      const song = new Song();
      song.lines = ['foo', 'bar'].map(value => new LineStub(value));
      song.metaData = { foo: 'bar' };
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
