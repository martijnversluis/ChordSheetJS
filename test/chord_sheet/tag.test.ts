import { Tag } from '../../src';

describe('Tag', () => {
  const expectedAliases = {
    t: 'title',
    st: 'subtitle',
    c: 'comment',
  };

  Object.keys(expectedAliases).forEach((alias) => {
    const fullTagName = expectedAliases[alias];

    it(`translates the tag alias ${alias} to the full tag name ${fullTagName}`, () => {
      expect(new Tag(fullTagName, 'value').name).toEqual(fullTagName);
      expect(new Tag(alias, 'value').name).toEqual(fullTagName);
    });
  });

  describe('#originalName', () => {
    Object.keys(expectedAliases).forEach((alias) => {
      it(`returns the non-translated name for ${alias}`, () => {
        expect(new Tag(alias, 'value').originalName).toEqual(alias);
      });
    });
  });

  describe('#hasValue', () => {
    it('checks whether the tag value is present', () => {
      expect(new Tag('foo', '').hasValue()).toBe(false);
      expect(new Tag('foo', '  ').hasValue()).toBe(false);
      expect(new Tag('foo', 'bar').hasValue()).toBe(true);
    });
  });

  describe('#isRenderable', () => {
    it('checks whether the tag should be rendered', () => {
      expect(new Tag('comment', 'foobar').isRenderable()).toBe(true);
      expect(new Tag('x_some_setting', 'foobar').isRenderable()).toBe(false);
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

    it('can parse {meta:name value}', () => {
      const tag = Tag.parse('meta:foo bar ber');

      expect(tag.name).toEqual('foo');
      expect(tag.value).toEqual('bar ber');
    });

    it('can parse {meta: name value}', () => {
      const tag = Tag.parse('meta: foo bar ber');

      expect(tag.name).toEqual('foo');
      expect(tag.value).toEqual('bar ber');
    });
  });
});
