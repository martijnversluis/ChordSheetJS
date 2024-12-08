import { Tag } from '../../src';
import {
  END_OF_ABC,
  END_OF_BRIDGE,
  END_OF_CHORUS,
  END_OF_GRID,
  END_OF_LY,
  END_OF_TAB,
  END_OF_VERSE,
  START_OF_ABC,
  START_OF_BRIDGE,
  START_OF_CHORUS,
  START_OF_GRID,
  START_OF_LY,
  START_OF_TAB, START_OF_VERSE,
} from '../../src/chord_sheet/tag';

describe('Tag', () => {
  const expectedAliases = {
    c: 'comment',
    cf: 'chordfont',
    cs: 'chordsize',
    eob: 'end_of_bridge',
    eoc: 'end_of_chorus',
    eog: 'end_of_grid',
    eot: 'end_of_tab',
    eov: 'end_of_verse',
    nk: 'new_key',
    sob: 'start_of_bridge',
    soc: 'start_of_chorus',
    sog: 'start_of_grid',
    sot: 'start_of_tab',
    sov: 'start_of_verse',
    st: 'subtitle',
    t: 'title',
    tf: 'textfont',
    ts: 'textsize',
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

    it('returns true for custom environment directives with label', () => {
      expect(new Tag('start_of_solo', 'some label').isRenderable()).toBe(true);
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

  const sectionEndTags = [
    END_OF_ABC,
    END_OF_BRIDGE,
    END_OF_CHORUS,
    END_OF_GRID,
    END_OF_LY,
    END_OF_TAB,
    END_OF_VERSE,
  ];

  const sectionStartTags = [
    START_OF_ABC,
    START_OF_BRIDGE,
    START_OF_CHORUS,
    START_OF_GRID,
    START_OF_LY,
    START_OF_TAB,
    START_OF_VERSE,
  ];

  describe('#isSectionDelimiter', () => {
    [...sectionStartTags, ...sectionEndTags].forEach((tag) => {
      it(`returns true for ${tag}`, () => {
        expect(new Tag(tag, 'value').isSectionDelimiter()).toBe(true);
      });
    });

    it('returns false for other tags', () => {
      expect(new Tag('foo', 'value').isSectionDelimiter()).toBe(false);
    });
  });

  describe('#isSectionEnd', () => {
    sectionEndTags.forEach((tag) => {
      it(`returns true for ${tag}`, () => {
        expect(new Tag(tag, 'value').isSectionEnd()).toBe(true);
      });
    });

    it('returns false for other tags', () => {
      expect(new Tag('foo', 'value').isSectionEnd()).toBe(false);
    });
  });

  describe('#isSectionStart', () => {
    sectionStartTags.forEach((tag) => {
      it(`returns true for ${tag}`, () => {
        expect(new Tag(tag, 'value').isSectionStart()).toBe(true);
      });
    });

    it('returns false for other tags', () => {
      expect(new Tag('foo', 'value').isSectionStart()).toBe(false);
    });
  });
});
