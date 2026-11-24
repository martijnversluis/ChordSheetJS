import ChordDiagram from '../../src/chord_diagram/chord_diagram';
import { Renderer } from '../../src/chord_diagram/renderer';

interface RecordedLine { x1: number, y1: number, x2: number, y2: number }
interface RecordedCircle { x: number, y: number, fill?: boolean }

function createRecordingRenderer() {
  const lines: RecordedLine[] = [];
  const circles: RecordedCircle[] = [];

  const renderer: Renderer = {
    circle: ({ x, y, fill }) => { circles.push({ x, y, fill }); },
    line: ({
      x1, y1, x2, y2,
    }) => {
      lines.push({
        x1, y1, x2, y2,
      });
    },
    rect: () => {},
    text: () => {},
  };

  return { renderer, lines, circles };
}

describe('ChordDiagram', () => {
  describe('with fewer than 6 strings', () => {
    it('positions finger markers on the strings', () => {
      const diagram = new ChordDiagram({
        chord: 'C',
        stringCount: 4,
        openStrings: [1, 2, 3],
        markers: [{ string: 4, fret: 3 }],
        baseFret: 1,
      });

      const { renderer, lines, circles } = createRecordingRenderer();
      diagram.render(renderer);

      const stringXs = lines
        .filter(({
          x1, x2, y1, y2,
        }) => x1 === x2 && y1 !== y2)
        .map(({ x1 }) => x1);

      expect(stringXs).toHaveLength(4);

      const markers = circles.filter(({ fill }) => fill);
      expect(markers).toHaveLength(1);
      expect(markers[0].x).toEqual(stringXs[3]);
    });
  });
});
