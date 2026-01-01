import { processMetadata } from '../../src/template_helpers';
import { MetadataConfiguration, MetadataRule } from '../../src/formatter/configuration/base_configuration';

describe('processMetadata', () => {
  it('returns correct pairs for simple string order', () => {
    const metadata = { title: 'Imagine', artist: 'John Lennon', year: '1971' };
    const config: MetadataConfiguration = {
      order: ['title', 'artist', 'year'],
      separator: ',',
    };
    expect(processMetadata(metadata, config)).toEqual([
      ['title', 'Imagine'], ['artist', 'John Lennon'], ['year', '1971'],
    ]);
  });

  it('skips missing keys in metadata', () => {
    const metadata = { title: 'Imagine', year: '1971' };
    const config: MetadataConfiguration = {
      order: ['title', 'artist', 'year'],
      separator: ',',
    };
    expect(processMetadata(metadata, config)).toEqual([
      ['title', 'Imagine'], ['year', '1971'],
    ]);
  });

  it('handles rule with match string', () => {
    const metadata = { key: 'C', tempo: '80' };
    const rule: MetadataRule = { match: 'key', sortMethod: 'alphabetical' };
    const config: MetadataConfiguration = {
      order: [rule],
      separator: ',',
    };
    expect(processMetadata(metadata, config)).toEqual([
      ['key', 'C'],
    ]);
  });

  it('handles rule with match array and preserve order', () => {
    const metadata = { genre: 'Pop', year: '1971', album: 'Imagine' };
    const rule: MetadataRule = { match: ['album', 'genre'], sortMethod: 'preserve' };
    const config: MetadataConfiguration = {
      order: [rule],
      separator: ',',
    };
    expect(processMetadata(metadata, config)).toEqual([
      ['album', 'Imagine'], ['genre', 'Pop'],
    ]);
  });

  it('handles rule with match RegExp', () => {
    const metadata = { composer: 'John Lennon', lyricist: 'John Lennon', arranger: 'Phil Spector' };
    const rule: MetadataRule = { match: /^arr/, sortMethod: 'alphabetical' };
    const config: MetadataConfiguration = {
      order: [rule],
      separator: ',',
    };
    expect(processMetadata(metadata, config)).toEqual([
      ['arranger', 'Phil Spector'],
    ]);
  });

  it('handles rule with match function', () => {
    const metadata = { copyright: '© 1971', source: 'EMI', website: 'example.com' };
    const rule: MetadataRule = { match: (k: string) => k !== 'source', sortMethod: 'alphabetical' };
    const config: MetadataConfiguration = {
      order: [rule],
      separator: ',',
    };
    expect(processMetadata(metadata, config)).toEqual([
      ['copyright', '© 1971'], ['website', 'example.com'],
    ]);
  });

  it('handles rule with visible=false', () => {
    const metadata = { title: 'Imagine', artist: 'John Lennon' };
    const rule: MetadataRule = { match: ['title', 'artist'], visible: false, sortMethod: 'alphabetical' };
    const config: MetadataConfiguration = {
      order: [rule],
      separator: ',',
    };
    expect(processMetadata(metadata, config)).toEqual([]);
  });

  it('handles custom sortMethod', () => {
    const metadata = { key: 'C', tempo: '80', capo: '2' };
    const rule: MetadataRule = {
      match: ['key', 'tempo', 'capo'],
      sortMethod: 'custom',
      customSort: (x: string, y: string) => y.localeCompare(x),
    };
    const config: MetadataConfiguration = {
      order: [rule],
      separator: ',',
    };
    expect(processMetadata(metadata, config)).toEqual([
      ['tempo', '80'], ['key', 'C'], ['capo', '2'],
    ]);
  });

  it('returns empty array for empty metadata', () => {
    const metadata = {};
    const config: MetadataConfiguration = {
      order: ['title', 'artist'],
      separator: ',',
    };
    expect(processMetadata(metadata, config)).toEqual([]);
  });

  it('returns empty array for empty order', () => {
    const metadata = { title: 'Imagine', artist: 'John Lennon' };
    const config: MetadataConfiguration = {
      order: [],
      separator: ',',
    };
    expect(processMetadata(metadata, config)).toEqual([]);
  });

  it('does not duplicate keys', () => {
    const metadata = { title: 'Imagine', artist: 'John Lennon' };
    const config: MetadataConfiguration = {
      order: ['title', 'title', 'artist'],
      separator: ',',
    };
    expect(processMetadata(metadata, config)).toEqual([
      ['title', 'Imagine'], ['artist', 'John Lennon'],
    ]);
  });
});

describe('dummy', () => {
  it('should run a dummy test', () => {
    expect(1 + 1).toBe(2);
  });
});
