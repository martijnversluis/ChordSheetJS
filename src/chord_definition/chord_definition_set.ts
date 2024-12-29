import ChordDefinition from './chord_definition';
import chordDefinitions from './defaults.json';

export type DefinitionSet = Record<string, ChordDefinition>;

class ChordDefinitionSet {
  definitions: DefinitionSet;

  constructor(definitions?: DefinitionSet) {
    this.definitions = definitions || {};
  }

  get(chord: string): ChordDefinition | null {
    return this.definitions[chord] || null;
  }

  withDefaults() {
    const defaultDefinitions: Record<string, string> = chordDefinitions;
    const clone = this.clone();

    Object.keys(defaultDefinitions).forEach((chord: string) => {
      const definition = ChordDefinition.parse(defaultDefinitions[chord]);

      if (!clone.has(chord)) {
        clone.add(chord, definition);
      }
    });

    return clone;
  }

  add(chord: string, definition: ChordDefinition) {
    this.definitions[chord] = definition;
  }

  has(chord: string): boolean {
    return chord in this.definitions;
  }

  clone(): ChordDefinitionSet {
    const clone = new ChordDefinitionSet();

    Object.keys(this.definitions).forEach((chord: string) => {
      clone.add(chord, this.definitions[chord].clone());
    });

    return clone;
  }
}

export default ChordDefinitionSet;
