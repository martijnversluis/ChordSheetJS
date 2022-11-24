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
    it('returns true for comments', () => {
      expect(new Tag('comment', 'foobar').isRenderable()).toBe(true);
    });

    it('returns true for environment directives with label', () => {
      ['start_of_chorus', 'start_of_verse', 'start_of_bridge', 'start_of_tab'].forEach((tag) => {
        expect(new Tag(tag, 'some label').isRenderable()).toBe(true);
      });
    });

    it('returns false for environment directives without label', () => {
      ['start_of_chorus', 'start_of_verse', 'start_of_bridge', 'start_of_tab'].forEach((tag) => {
        expect(new Tag(tag, '').isRenderable()).toBe(false);
      });
    });

    it('returns false for any other tag', () => {
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
      const tag = Tag.parseOrFail('foo');

      expect(tag.name).toEqual('foo');
      expect(tag.value).toEqual('');
    });

    it('can parse {name:value}', () => {
      const tag = Tag.parseOrFail('foo:bar ber');

      expect(tag.name).toEqual('foo');
      expect(tag.value).toEqual('bar ber');
    });

    it('can parse {name value}', () => {
      const tag = Tag.parseOrFail('foo bar ber');

      expect(tag.name).toEqual('foo');
      expect(tag.value).toEqual('bar ber');
    });

    it('can parse {name: value}', () => {
      const tag = Tag.parseOrFail('foo: bar ber');

      expect(tag.name).toEqual('foo');
      expect(tag.value).toEqual('bar ber');
    });

    it('can parse {meta:name value}', () => {
      const tag = Tag.parseOrFail('meta:foo bar ber');

      expect(tag.name).toEqual('foo');
      expect(tag.value).toEqual('bar ber');
    });

    it('can parse {meta: name value}', () => {
      const tag = Tag.parseOrFail('meta: foo bar ber');

      expect(tag.name).toEqual('foo');
      expect(tag.value).toEqual('bar ber');
    });
  });
});
