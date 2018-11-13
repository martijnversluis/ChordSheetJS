import { expect } from 'chai';

import Metadata from '../../src/chord_sheet/metadata';

describe('Metadata', () => {
  it('stores scalar data', () => {
    const metadata = new Metadata({ foo: 'bar' });

    expect(metadata.get('foo')).to.eql('bar');
  });

  it('stores array data', () => {
    const metadata = new Metadata({ foo: ['bar', 'baz'] });

    expect(metadata.get('foo')).to.eql(['bar', 'baz']);
  });

  describe('#getExtended', () => {
    it('returns the metadata with scalar array values', () => {
      const metadata = new Metadata({
        list: ['one', 'two'],
        key: 'value',
      });

      expect(metadata.getExtended()).to.eql({
        list: ['one', 'two'],
        key: 'value',
        'list.1': 'one',
        'list.2': 'two',
      });
    });
  });

  describe('#clone', () => {
    it('returns a deep copy of the metadata', () => {
      const metadata = new Metadata({ foo: 'bar' });
      const clone = metadata.clone();

      expect(clone.getAll()).to.eql({ foo: 'bar' });
    });
  });
});
