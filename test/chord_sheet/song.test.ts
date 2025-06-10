import Metadata from '../../src/chord_sheet/metadata';
import Song from '../../src/chord_sheet/song';

import { configure } from '../../src/formatter/configuration';
import { ChordLyricsPair, ChordSheetSerializer, Tag } from '../../src';
import { changedSongSolfege, changedSongSymbol } from '../fixtures/changed_song';
import { exampleSongSolfege, exampleSongSymbol } from '../fixtures/song';
import { serializedSongSolfege, serializedSongSymbol } from '../fixtures/serialized_song';

import {
  chordLyricsPair,
  createChordDefinition,
  createChordLyricsPair,
  createLine,
  createSong,
  createSongFromAst,
  createTag,
  tag,
} from '../utilities';

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
    it('returns a clone of the symbol song', () => {
      const serializedExampleSong = new ChordSheetSerializer().serialize(exampleSongSymbol);
      const clone = exampleSongSymbol.clone();
      const serializedClone = new ChordSheetSerializer().serialize(clone);
      expect(serializedClone).toEqual(serializedExampleSong);
    });

    it('returns a clone of the solfege song', () => {
      const serializedExampleSong = new ChordSheetSerializer().serialize(exampleSongSolfege);
      const clone = exampleSongSolfege.clone();
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
    it('changes the symbol song', () => {
      const song = exampleSongSymbol.clone();

      [0, 1, 3, 2].forEach((expectedLineCount, index) => {
        expect(song.paragraphs[index].lines).toHaveLength(expectedLineCount);
      });

      const changedSong = song.mapLines((line) => (
        line.mapItems((item) => {
          if (item instanceof ChordLyricsPair) {
            return item
              .transpose(2, 'D')
              .setLyrics((item.lyrics || '').toUpperCase())
              .setAnnotation((item.annotation || '').toUpperCase());
          }

          if (item instanceof Tag) {
            let changedTag = item.set({ value: `${item.value} changed` });

            if (item.attributes.label) {
              changedTag = changedTag.setAttribute('label', `${item.attributes.label} changed`);
            }

            return changedTag;
          }

          return item;
        })
      ));

      expect(new ChordSheetSerializer().serialize(changedSong)).toEqual(changedSongSymbol);
      expect(changedSong.title).toEqual('Let it be changed');
      expect(changedSong.subtitle).toEqual('ChordSheetJS example version changed');
      expect(changedSong.key).toEqual('C changed');
      expect(changedSong.composer).toEqual(['John Lennon changed', 'Paul McCartney changed']);
      expect(changedSong.paragraphs.length).toEqual(song.paragraphs.length);

      [0, 1, 3, 3].forEach((expectedLineCount, index) => {
        expect(changedSong.paragraphs[index].lines).toHaveLength(expectedLineCount);
      });
    });

    it('changes the solfege song', () => {
      const song = exampleSongSolfege.clone();

      [0, 1, 3, 2].forEach((expectedLineCount, index) => {
        expect(song.paragraphs[index].lines).toHaveLength(expectedLineCount);
      });

      const changedSong = song.mapLines((line) => (
        line.mapItems((item) => {
          if (item instanceof ChordLyricsPair) {
            return item
              .transpose(2, 'Re')
              .setLyrics((item.lyrics || '').toUpperCase())
              .setAnnotation((item.annotation || '').toUpperCase());
          }

          if (item instanceof Tag) {
            return item.set({ value: `${item.value} changed` });
          }

          return item;
        })
      ));

      expect(new ChordSheetSerializer().serialize(changedSong)).toEqual(changedSongSolfege);
      expect(changedSong.title).toEqual('Let it be changed');
      expect(changedSong.subtitle).toEqual('ChordSheetJS example version changed');
      expect(changedSong.key).toEqual('Do changed');
      expect(changedSong.composer).toEqual(['John Lennon changed', 'Paul McCartney changed']);
      expect(changedSong.paragraphs.length).toEqual(song.paragraphs.length);

      [0, 1, 3, 3].forEach((expectedLineCount, index) => {
        expect(changedSong.paragraphs[index].lines).toHaveLength(expectedLineCount);
      });
    });
  });

  describe('#mapItems', () => {
    it('changes the symbol song', () => {
      const song = exampleSongSymbol.clone();
      expect(song.paragraphs.map((p) => p.lines.length)).toEqual([0, 1, 3, 2, 2, 3, 3, 3, 3, 2, 3]);

      const changedSong = song.mapItems((item) => {
        if (item instanceof ChordLyricsPair) {
          return item
            .transpose(2, 'D')
            .setLyrics((item.lyrics || '').toUpperCase())
            .setAnnotation((item.annotation || '').toUpperCase());
        }

        if (item instanceof Tag) {
          let changedTag = item.set({ value: `${item.value} changed` });

          if (item.attributes.label) {
            changedTag = changedTag.setAttribute('label', `${item.attributes.label} changed`);
          }

          return changedTag;
        }

        return item;
      });

      expect(new ChordSheetSerializer().serialize(changedSong)).toEqual(changedSongSymbol);
      expect(changedSong.title).toEqual('Let it be changed');
      expect(changedSong.subtitle).toEqual('ChordSheetJS example version changed');
      expect(changedSong.key).toEqual('C changed');
      expect(changedSong.composer).toEqual(['John Lennon changed', 'Paul McCartney changed']);
      expect(changedSong.paragraphs.length).toEqual(song.paragraphs.length);

      [0, 1, 3, 3].forEach((expectedLineCount, index) => {
        expect(changedSong.paragraphs[index].lines).toHaveLength(expectedLineCount);
      });
    });

    it('changes the solfege song', () => {
      const song = exampleSongSolfege.clone();
      expect(song.paragraphs.map((p) => p.lines.length)).toEqual([0, 1, 3, 2, 2, 3, 3, 3, 3, 2, 3]);

      const changedSong = song.mapItems((item) => {
        if (item instanceof ChordLyricsPair) {
          return item
            .transpose(2, 'Re')
            .setLyrics((item.lyrics || '').toUpperCase())
            .setAnnotation((item.annotation || '').toUpperCase());
        }

        if (item instanceof Tag) {
          return item.set({ value: `${item.value} changed` });
        }

        return item;
      });

      expect(new ChordSheetSerializer().serialize(changedSong)).toEqual(changedSongSolfege);
      expect(changedSong.title).toEqual('Let it be changed');
      expect(changedSong.subtitle).toEqual('ChordSheetJS example version changed');
      expect(changedSong.key).toEqual('Do changed');
      expect(changedSong.composer).toEqual(['John Lennon changed', 'Paul McCartney changed']);
      expect(changedSong.paragraphs.length).toEqual(song.paragraphs.length);

      [0, 1, 3, 3].forEach((expectedLineCount, index) => {
        expect(changedSong.paragraphs[index].lines).toHaveLength(expectedLineCount);
      });
    });
  });

  it('symbol can be serialized', () => {
    expect(new ChordSheetSerializer().serialize(exampleSongSymbol)).toEqual(serializedSongSymbol);
  });

  it('symbol can be deserialized', () => {
    expect(new ChordSheetSerializer().deserialize(serializedSongSymbol)).toEqual(exampleSongSymbol);
  });

  it('solfege can be serialized', () => {
    expect(new ChordSheetSerializer().serialize(exampleSongSolfege)).toEqual(serializedSongSolfege);
  });

  it('solfege can be deserialized', () => {
    expect(new ChordSheetSerializer().deserialize(serializedSongSolfege)).toEqual(exampleSongSolfege);
  });

  describe('#getChords', () => {
    it('returns the unique chords in a song', () => {
      const song = createSong([
        createLine([
          createChordLyricsPair('CM7', 'let'),
          createChordLyricsPair('', 'it'),
          createChordLyricsPair('Dm7', ''),
          createChordLyricsPair('Dm7   ', ''),
        ]),
        createLine([]),
        createLine([
          createChordLyricsPair('F#', 'be'),
          createChordLyricsPair('d#', 'be'),
          createChordLyricsPair('     F#', 'be'),
          createChordLyricsPair('', 'changed'),
        ]),
      ]);

      expect(song.getChords()).toEqual(['CM7', 'Dm7', 'F#', 'D#']);
    });

    it('returns an empty array if there are no chords in the song', () => {
      const song = createSong([
        createLine([
          createChordLyricsPair('', 'let'),
          createChordLyricsPair('', 'it'),
          createChordLyricsPair('', ''),
        ]),
        createLine([]),
        createLine([
          createChordLyricsPair('', 'be'),
          createChordLyricsPair('', 'changed'),
        ]),
      ]);

      expect(song.getChords()).toEqual([]);
    });
  });

  describe('#getChordDefinitions', () => {
    it('returns the unique chord definitions in a song', () => {
      const cm7 = createChordDefinition('CM7', 3, ['x', '0', 1]);
      const dm = createChordDefinition('Dm', 3, ['x', 3, 5]);

      const song = createSong([
        createLine([
          createTag('chord', 'CM7', cm7),
        ]),
        createLine([]),
        createLine([
          createTag('define', 'Dm', dm),
        ]),
      ]);

      expect(song.getChordDefinitions()).toEqual({
        CM7: cm7,
        Dm: dm,
      });
    });

    it('returns an empty array if there are no chords in the song', () => {
      const song = createSong([
        createLine([
          createTag('chord', 'CM7'),
        ]),
        createLine([]),
        createLine([
          createChordLyricsPair('Am', 'be'),
        ]),
      ]);

      expect(song.getChordDefinitions()).toEqual({});
    });

    it('leaves out chord definitions with non-matching selector', () => {
      const cm7 = createChordDefinition('CM7', 3, ['x', '0', 1]);
      const dm = createChordDefinition('Dm', 3, ['x', 3, 5]);

      const configuration = configure({ instrument: { type: 'ukulele' } });
      const metadata = new Metadata();

      const song = createSong([
        createLine([
          createTag('chord', 'CM7', cm7, 'guitar'),
        ]),
        createLine([]),
        createLine([
          createTag('define', 'Dm', dm, 'ukulele'),
        ]),
      ]);

      expect(song.getChordDefinitions({ configuration, metadata })).toEqual({ Dm: dm });
    });

    it('leaves out chord definitions with a negated matching selector', () => {
      const cm7 = createChordDefinition('CM7', 3, ['x', '0', 1]);
      const dm = createChordDefinition('Dm', 3, ['x', 3, 5]);

      const configuration = configure({ instrument: { type: 'guitar' } });
      const metadata = new Metadata();

      const song = createSong([
        createLine([
          createTag('chord', 'CM7', cm7, 'guitar', true),
        ]),
        createLine([]),
        createLine([
          createTag('define', 'Dm', dm),
        ]),
      ]);

      expect(song.getChordDefinitions({ configuration, metadata })).toEqual({ Dm: dm });
    });
  });

  describe('#chordDefinitions', () => {
    it('returns the unique chord definitions in a song', () => {
      const cm7 = createChordDefinition('CM7', 3, ['x', '0', 1]);
      const dm = createChordDefinition('Dm', 3, ['x', 3, 5]);

      const song = createSong([
        createLine([
          createTag('chord', 'CM7', cm7),
        ]),
        createLine([]),
        createLine([
          createTag('define', 'Dm', dm),
        ]),
      ]);

      expect(song.chordDefinitions.get('CM7')).toEqual(cm7);
      expect(song.chordDefinitions.get('Dm')).toEqual(dm);
    });
  });

  describe('#normalizeChords', () => {
    it('normalizes the chords in a song', () => {
      const song = createSong([
        createLine([
          createChordLyricsPair('G/Cb', 'let it'),
          createChordLyricsPair('E#/G', 'it'),
        ]),
      ]);

      const normalizedSong = song.normalizeChords();

      expect((normalizedSong.paragraphs[0].lines[0].items[0] as ChordLyricsPair).chords).toEqual('G/B');
      expect((normalizedSong.paragraphs[0].lines[0].items[1] as ChordLyricsPair).chords).toEqual('F/G');
    });

    it('normalizes the chords in a song against a specific key', () => {
      const song = createSong(
        [
          createLine([
            createChordLyricsPair('Fb', 'let it'),
          ]),
        ],
        { key: 'Gb' },
      );

      const normalizedSong = song.normalizeChords('F#');
      expect((normalizedSong.paragraphs[0].lines[0].items[0] as ChordLyricsPair).chords).toEqual('E');
    });

    it('optionally normalizes the suffix', () => {
      const song = createSong(
        [
          createLine([
            createChordLyricsPair('Fbadd9', 'let it'),
          ]),
        ],
        { key: 'Gb' },
      );

      const normalizedSong = song.normalizeChords('F#', { normalizeSuffix: true });
      expect((normalizedSong.paragraphs[0].lines[0].items[0] as ChordLyricsPair).chords).toEqual('E(9)');
    });
  });

  describe('#useModifier', () => {
    it('changes the modifier of the chords in a song', () => {
      const song = createSongFromAst([
        [
          chordLyricsPair('G#', 'let it'),
          chordLyricsPair('F#', 'it'),
        ],
      ]);

      const modifiedSong = song.useModifier('b');

      expect((modifiedSong.paragraphs[0].lines[0].items[0] as ChordLyricsPair).chords).toEqual('Ab');
      expect((modifiedSong.paragraphs[0].lines[0].items[1] as ChordLyricsPair).chords).toEqual('Gb');
    });

    it('updates the key of the song', () => {
      const song = createSongFromAst([
        [tag('key', 'F#')],
      ]);

      const modifiedSong = song.useModifier('b');

      expect(modifiedSong.key).toEqual('Gb');
    });
  });
});
