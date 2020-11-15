import '../matchers';
import Metadata from '../../src/chord_sheet/metadata';

describe('Metadata', () => {
  describe('new', () => {
    it('creates a new instance', () => {
      const metadata = new Metadata();
      expect(Object.keys(metadata)).toHaveLength(0);
    });

    it('creates a new instance with data', () => {
      const metadata = new Metadata({ title: 'Another Song', author: ['John', 'Steve'] });

      expect(Object.keys(metadata)).toHaveLength(2);
      expect(metadata.title).toEqual('Another Song');
      expect(metadata.author).toEqual(['John', 'Steve']);
    });
  });

  describe('add', () => {
    it('sets a value', () => {
      const metadata = new Metadata();
      metadata.add('author', 'Steve');
      expect(Object.keys(metadata)).toHaveLength(1);
      expect(metadata).toEqual({ author: 'Steve' });
    });

    it('appends a value', () => {
      const metadata = new Metadata({ title: 'Another Song', author: 'John' });
      metadata.add('author', 'Steve');

      expect(Object.keys(metadata)).toHaveLength(2);
      expect(metadata.title).toEqual('Another Song');
      expect(metadata.author).toEqual(['John', 'Steve']);
    });
  });
});
