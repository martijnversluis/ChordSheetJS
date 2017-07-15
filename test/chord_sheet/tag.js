import expect from 'expect';
import Tag from '../../src/chord_sheet/tag';

describe('Tag', () => {
  it('translates tag aliases to their full tag name', () => {
    const expectedAliases = {
      t: 'title',
      st: 'subtitle'
    };

    for (const alias in expectedAliases) {
      const fullTagName = expectedAliases[alias];
      expect(new Tag(fullTagName, 'value').name).toEqual(fullTagName);
      expect(new Tag(alias, 'value').name).toEqual(fullTagName);
    }
  });
});
