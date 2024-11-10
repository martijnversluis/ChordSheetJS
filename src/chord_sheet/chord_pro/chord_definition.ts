import { Fret } from '../../constants';

class ChordDefinition {
  name: string;

  baseFret: number;

  frets: Fret[];

  fingers: number[];

  constructor(name: string, baseFret: number, frets: Fret[], fingers?: number[]) {
    this.name = name;
    this.baseFret = baseFret;
    this.frets = frets;
    this.fingers = fingers || [];
  }
}

export default ChordDefinition;
