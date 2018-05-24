import { expect } from 'chai';

import Tag from '../../src/chord_sheet/tag';

describe('Tag', () => {
  const expectedAliases = {
    t: 'title',
    st: 'subtitle',
    c: 'comment',
  };

  Object.keys(expectedAliases).forEach((alias) => {
    const fullTagName = expectedAliases[alias];

    it(`translates the tag alias ${alias} to the full tag name ${fullTagName}`, () => {
      expect(new Tag(fullTagName, 'value').name).to.equal(fullTagName);
      expect(new Tag(alias, 'value').name).to.equal(fullTagName);
    });
  });

  describe('#originalName', () => {
    Object.keys(expectedAliases).forEach((alias) => {
      it(`returns the non-translated name for ${alias}`, () => {
        expect(new Tag(alias, 'value').originalName).to.equal(alias);
      });
    });
  });

  describe('#hasValue', () => {
    it('checks whether the tag value is present', () => {
      expect(new Tag('foo', '').hasValue()).to.be.false;
      expect(new Tag('foo', '  ').hasValue()).to.be.false;
      expect(new Tag('foo', 'bar').hasValue()).to.be.true;
    });
  });

  describe('#isRenderable', () => {
    it('checks whether the tag should be rendered', () => {
      expect(new Tag('comment', 'foobar').isRenderable()).to.be.true;
      expect(new Tag('x_some_setting', 'foobar').isRenderable()).to.be.false;
    });
  });

  describe('#clone', () => {
    it('returns a clone of the tag', () => {
      const tag = new Tag('foo', 'bar');
      const clonedTag = tag.clone();

      expect(clonedTag.name).to.equal('foo');
      expect(clonedTag.value).to.equal('bar');
    });
  });

  describe('::parse', () => {
    it('can parse {name}', () => {
      const tag = Tag.parse('foo');

      expect(tag.name).to.equal('foo');
      expect(tag.value).to.be.null;
    });

    it('can parse {name:value}', () => {
      const tag = Tag.parse('foo:bar ber');

      expect(tag.name).to.equal('foo');
      expect(tag.value).to.equal('bar ber');
    });

    it('can parse {name value}', () => {
      const tag = Tag.parse('foo bar ber');

      expect(tag.name).to.equal('foo');
      expect(tag.value).to.equal('bar ber');
    });

    it('can parse {name: value}', () => {
      const tag = Tag.parse('foo: bar ber');

      expect(tag.name).to.equal('foo');
      expect(tag.value).to.equal('bar ber');
    });
  });
});
