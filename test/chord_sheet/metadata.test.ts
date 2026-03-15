import { Metadata } from '../../src';

describe('Metadata', () => {
  describe('new', () => {
    it('creates a new instance', () => {
      const metadata = new Metadata();
      expect(metadata).toBeInstanceOf(Metadata);
      expect(Object.keys(metadata.metadata)).toHaveLength(0);
    });

    it('creates a new instance with data', () => {
      const metadata = new Metadata({ title: 'Another Song', composer: ['John', 'Steve'] });

      expect(Object.keys(metadata.metadata)).toHaveLength(2);
      expect(metadata.title).toEqual('Another Song');
      expect(metadata.composer).toEqual(['John', 'Steve']);
    });
  });

  describe('add', () => {
    it('sets a value', () => {
      const metadata = new Metadata();
      metadata.add('artist', 'Steve');
      expect(Object.keys(metadata.metadata)).toHaveLength(1);
      expect(metadata.metadata).toEqual({ artist: 'Steve' });
      expect(metadata.artist).toEqual('Steve');
    });

    it('appends a value', () => {
      const metadata = new Metadata({ title: 'Another Song', artist: 'John' });
      metadata.add('artist', 'Steve');

      expect(Object.keys(metadata.metadata)).toHaveLength(2);
      expect(metadata.title).toEqual('Another Song');
      expect(metadata.artist).toEqual(['John', 'Steve']);
    });
  });

  describe('get', () => {
    it('reads a string value', () => {
      const metadata = new Metadata({ author: 'John' });
      expect(metadata.get('author')).toEqual('John');
    });

    it('reads an array value', () => {
      const metadata = new Metadata({ author: ['John', 'Mary'] });
      expect(metadata.get('author')).toEqual(['John', 'Mary']);
    });

    it('reads a single array item', () => {
      const metadata = new Metadata({ author: ['John', 'Mary'] });
      expect(metadata.get('author.1')).toEqual('John');
      expect(metadata.get('author.2')).toEqual('Mary');
    });

    it('reads a single counting from the end', () => {
      const metadata = new Metadata({ author: ['John', 'Mary'] });
      expect(metadata.get('author.-1')).toEqual('Mary');
      expect(metadata.get('author.-2')).toEqual('John');
    });

    describe('when a single value does not exist', () => {
      it('returns undefined', () => {
        const metadata = new Metadata({});
        expect(metadata.get('author')).toBeNull();
      });
    });

    describe('when an array item does not exist', () => {
      it('returns undefined', () => {
        const metadata = new Metadata({ author: ['John', 'Mary'] });
        expect(metadata.get('author.5')).toBeUndefined();
      });
    });

    describe('_key', () => {
      it('is calculated when when key and capo are defined', () => {
        const metadata = new Metadata({ key: 'Bb', capo: '2' });
        expect(metadata.get('_key')).toEqual('C');
      });

      it('returns undefined when when key or capo is undefined', () => {
        const metadata = new Metadata({ key: 'Bb' });
        expect(metadata.get('_key')).toBeNull();
      });

      it('is readonly on initialisation', () => {
        const metadata = new Metadata({ _key: 'E' });
        expect(metadata.get('_key')).toBeNull();
      });

      it('is readonly', () => {
        const emptyMetadata = new Metadata();
        const metadata = new Metadata();
        metadata.add('_key', 'G');
        expect(metadata.get('_key')).toBeNull();
        expect(metadata).toEqual(emptyMetadata);
      });
    });
  });

  describe('merge', () => {
    it('returns a new Metadata object where metadata is merged with the supplied metadata', () => {
      const original = new Metadata({ artist: 'Bill', composer: 'John' });
      const merged = original.merge({ artist: 'Mary' });

      expect(merged.artist).toEqual('Mary');
      expect(merged.composer).toEqual('John');
    });

    it('does not deep-merge array values', () => {
      const original = new Metadata({ artist: ['Bill'], composer: 'John' });
      const merged = original.merge({ artist: ['Mary'] });

      expect(merged.artist).toEqual(['Mary']);
      expect(merged.composer).toEqual('John');
    });

    it('does not override read-only keys', () => {
      const original = new Metadata({ key: 'Ab', capo: '3' });
      const merged = original.merge({ _key: 'G#' });

      expect(merged.key).toEqual('Ab');
      expect(merged.capo).toEqual('3');
      expect(merged.get('_key')).toEqual('B');
    });
  });

  describe('providers', () => {
    describe('get', () => {
      it('returns provider value when key is not in explicit metadata', () => {
        const metadata = new Metadata();
        metadata.setProvider('chordpro', () => 'ChordPro');

        expect(metadata.get('chordpro')).toEqual('ChordPro');
      });

      it('returns explicit metadata over provider value', () => {
        const metadata = new Metadata({ title: 'Explicit Title' });
        metadata.setProvider('title', () => 'Provider Title');

        expect(metadata.get('title')).toEqual('Explicit Title');
      });

      it('supports dotted keys', () => {
        const metadata = new Metadata();
        metadata.setProvider('instrument.type', () => 'guitar');

        expect(metadata.get('instrument.type')).toEqual('guitar');
      });

      it('returns null when provider returns null', () => {
        const metadata = new Metadata();
        metadata.setProvider('instrument', () => null);

        expect(metadata.get('instrument')).toBeNull();
      });
    });

    describe('all', () => {
      it('includes provider values', () => {
        const metadata = new Metadata({ artist: 'John' });
        metadata.setProvider('chordpro', () => 'ChordPro');

        const all = metadata.all();

        expect(all.artist).toEqual('John');
        expect(all.chordpro).toEqual('ChordPro');
      });

      it('does not override explicit metadata with provider values', () => {
        const metadata = new Metadata({ title: 'Explicit' });
        metadata.setProvider('title', () => 'Provider');

        expect(metadata.all().title).toEqual('Explicit');
      });
    });

    describe('clone', () => {
      it('preserves providers', () => {
        const metadata = new Metadata();
        metadata.setProvider('chordpro', () => 'ChordPro');

        const cloned = metadata.clone();

        expect(cloned.get('chordpro')).toEqual('ChordPro');
      });
    });

    describe('contains', () => {
      it('returns false for provider-only keys', () => {
        const metadata = new Metadata();
        metadata.setProvider('chordpro', () => 'ChordPro');

        expect(metadata.contains('chordpro')).toBe(false);
      });
    });
  });

  describe('iterating', () => {
    it('returns all entries', () => {
      const metadata = new Metadata({ artist: 'Bill', composer: 'John' });

      expect([...metadata]).toEqual([
        ['artist', 'Bill'],
        ['composer', 'John'],
      ]);
    });

    it('includes _key when key and capo are defined', () => {
      const metadata = new Metadata({ key: 'Bb', capo: '2' });

      expect([...metadata]).toEqual([
        ['key', 'Bb'],
        ['capo', '2'],
        ['_key', 'C'],
      ]);
    });
  });
});
