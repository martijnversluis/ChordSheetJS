import expect from 'expect';
import Tag from '../../src/chord_sheet/tag';

describe('Tag', () => {
  const expectedAliases = {
    t: 'title',
    st: 'subtitle'
  };

  it('translates tag aliases to their full tag name', () => {
    for (const alias in expectedAliases) {
      const fullTagName = expectedAliases[alias];
      expect(new Tag(fullTagName, 'value').name).toEqual(fullTagName);
      expect(new Tag(alias, 'value').name).toEqual(fullTagName);
    }
  });

  describe('#originalName', () => {
    it('returns the non-translated name', () => {
      for (const alias in expectedAliases) {
        expect(new Tag(alias, 'value').originalName).toEqual(alias);
      }
    });
  });

  describe('#hasValue', () => {
    it('checks whether the tag value is present', () => {
      expect(new Tag('foo', '').hasValue()).toBe(false);
      expect(new Tag('foo', '  ').hasValue()).toBe(false);
      expect(new Tag('foo', 'bar').hasValue()).toBe(true);
    });
  });

  describe('#clone', () => {
    it('returns a clone of the tag', () => {
      const tag = new Tag('foo', 'bar');
      const clonedTag = tag.clone();

      expect(clonedTag.name).toEqual('foo');
      expect(clonedTag.value).toEqual('bar');
    });
  });

  describe('::parse', () => {
    it('can parse {name}', () => {
      const tag = Tag.parse('foo');

      expect(tag.name).toEqual('foo');
      expect(tag.value).toBe(null);
    });

    it('can parse {name:value}', () => {
      const tag = Tag.parse('foo:bar ber');

      expect(tag.name).toEqual('foo');
      expect(tag.value).toEqual('bar ber');
    });

    it('can parse {name value}', () => {
      const tag = Tag.parse('foo bar ber');

      expect(tag.name).toEqual('foo');
      expect(tag.value).toEqual('bar ber');
    });

    it('can parse {name: value}', () => {
      const tag = Tag.parse('foo: bar ber');

      expect(tag.name).toEqual('foo');
      expect(tag.value).toEqual('bar ber');
    });
  });
});
