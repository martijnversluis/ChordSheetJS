import ChordDefinition from '../../src/chord_definition/chord_definition';
import ChordDefinitionSet from '../../src/chord_definition/chord_definition_set';

describe('ChordDefinitionSet', () => {
  describe('#get', () => {
    it('returns a chord definition when present for the chord', () => {
      const chordDefinition = ChordDefinition.parse(' D7 base-fret 3 frets x 3 2 3 1 x ');

      const definitionSet = new ChordDefinitionSet({
        'D7': chordDefinition,
      });

      expect(definitionSet.get('D7')).toEqual(chordDefinition);
    });

    it('returns null when there is no definition for the chord', () => {
      const definitionSet = new ChordDefinitionSet();

      expect(definitionSet.get('A')).toBeNull();
    });
  });

  describe('#withDefaults', () => {
    it('loads the defaults for missing definitions', () => {
      const d7OpenGm = ChordDefinition.parse('D7 base-fret 0 frets 0 2 4 4 2 4');
      const am = ChordDefinition.parse('Am base-fret 0 frets x 0 2 2 1 0');

      const chordDefinitionSet =
        new ChordDefinitionSet({
          'D7': d7OpenGm,
          'Am': am,
        })
          .withDefaults();

      expect(chordDefinitionSet.get('D7')).toEqual(d7OpenGm);
      expect(chordDefinitionSet.get('Am')).toEqual(am);
    });
  });

  describe('#add', () => {
    it('adds a chord definition for a tuning', () => {
      const definition = ChordDefinition.parse('A base-fret 0 frets 0 1 2 2 2 0');
      const library = new ChordDefinitionSet();

      library.add('A', definition);

      expect(library.get('A')).toEqual(definition);
    });
  });
});
