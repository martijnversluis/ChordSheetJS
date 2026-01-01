import { Renderer } from './renderer';
import { FingerNumber, FretNumber, StringNumber } from '../constants';

/**
 * Represents a barre (bar) in a chord diagram, where one finger presses multiple strings at the same fret.
 */
export interface Barre {
  /** The starting string number (lowest). */
  from: StringNumber;
  /** The ending string number (highest). */
  to: StringNumber;
  /** The fret position of the barre. */
  fret: FretNumber;
}

type StringList = StringNumber[];

/**
 * Represents a finger position marker on a specific string and fret in a chord diagram.
 */
export interface StringMarker {
  /** The string number where the finger is placed. */
  string: StringNumber;
  /** The fret number where the finger is placed. */
  fret: FretNumber;
  /** Optional finger number (1-4) used to press this position. */
  finger?: FingerNumber;
}

/**
 * Defines the structure of a chord diagram, including finger positions, barres, and string states.
 */
export interface ChordDiagramDefinition {
  /** Array of barres in the chord. */
  barres: Barre[];
  /** The chord name displayed as the diagram title. */
  chord: string;
  /** Number of frets to display in the diagram. */
  fretCount: number;
  /** Array of finger position markers. */
  markers: StringMarker[];
  /** String numbers that are played open (unfingered). */
  openStrings: StringList;
  /** Total number of strings on the instrument. */
  stringCount: number;
  /** String numbers that are muted/not played. */
  unusedStrings: StringList;
  /** The starting fret position (1 for standard position, higher for transposed chords). */
  baseFret: number;
}

/**
 * Configuration options for rendering a chord diagram, controlling dimensions, colors, and visual styling.
 */
export interface ChordDiagramRenderingConfig {
  /** Vertical position of the chord title. */
  titleY: number;
  /** Width of the guitar neck area. */
  neckWidth: number;
  /** Height of the guitar neck area. */
  neckHeight: number;
  /** Thickness of the nut (top bar) at the first fret. */
  nutThickness: number;
  /** Color of the nut. */
  nutColor: number|string;
  /** Thickness of regular fret bars. */
  fretThickness: number;
  /** Color of the fret lines. */
  fretColor: number|string;
  /** Color of the strings. */
  stringColor: number|string;
  /** Size of open/muted string indicators above the nut. */
  stringIndicatorSize: number;
  /** Size of finger position markers on the fretboard. */
  fingerIndicatorSize: number;
  /** Vertical offset adjustment for finger indicators. */
  fingerIndicatorOffset: number;
  /** Thickness of the string lines. */
  stringThickness: number;
  /** Thickness of the fret lines. */
  fretLineThickness: number;
  /** Line thickness for open string (circle) indicators. */
  openStringIndicatorThickness: number;
  /** Line thickness for muted string (X) indicators. */
  unusedStringIndicatorThickness: number;
  /** Line thickness for finger position markers. */
  markerThickness: number;
  /** Line thickness for barre indicators. */
  barreThickness: number;
  /** Font size for the chord title. */
  titleFontSize: number;
  /** Font size for the base fret number (when transposed). */
  baseFretFontSize: number;
  /** Font size for finger numbers below the diagram. */
  fingerNumberFontSize: number;
  /** Whether to display finger numbers below the diagram. */
  showFingerNumbers: boolean;
  /** Horizontal spacing between multiple diagrams. */
  diagramSpacing: number;
  /** Maximum number of diagrams per row (optional). */
  maxDiagramsPerRow?: number|null;
}

const defaultChordDiagramDefinition: ChordDiagramDefinition = {
  barres: [],
  chord: '',
  fretCount: 4,
  markers: [],
  openStrings: [],
  stringCount: 6,
  unusedStrings: [],
  baseFret: 0,
};

/**
 * Default configuration values for rendering chord diagrams.
 */
export const DefaultChordDiagramRenderingConfig: ChordDiagramRenderingConfig = {
  titleY: 28,
  neckWidth: 120,
  neckHeight: 160,
  nutThickness: 10,
  fretThickness: 4,
  nutColor: 0,
  fretColor: '#929292',
  stringIndicatorSize: 14,
  fingerIndicatorSize: 16,
  stringColor: 0,
  fingerIndicatorOffset: 0,
  stringThickness: 3,
  fretLineThickness: 4,
  openStringIndicatorThickness: 2,
  unusedStringIndicatorThickness: 2,
  markerThickness: 2,
  barreThickness: 2,
  titleFontSize: 48,
  baseFretFontSize: 8,
  fingerNumberFontSize: 28,
  showFingerNumbers: true,
  diagramSpacing: 7,
};

function repeat(count: number, callback: (i: number) => void): void {
  Array.from({ length: count }).forEach((_, i) => callback(i));
}

/**
 * Renders a visual chord diagram for guitar or similar stringed instruments.
 *
 * A chord diagram displays finger positions, barres, open strings, and muted strings
 * on a graphical representation of the instrument's fretboard.
 */
class ChordDiagram {
  chordDiagramDefinition: ChordDiagramDefinition;

  renderer?: Renderer;

  config: ChordDiagramRenderingConfig;

  constructor(chordDiagramDefinition: Partial<ChordDiagramDefinition>, config?: Partial<ChordDiagramRenderingConfig>) {
    this.chordDiagramDefinition = { ...defaultChordDiagramDefinition, ...chordDiagramDefinition };
    this.config = { ...DefaultChordDiagramRenderingConfig, ...config };
  }

  get neckX() {
    return (this.config.stringIndicatorSize / 2) + 1;
  }

  get neckY() {
    return this.stringIndicatorY + this.config.stringIndicatorSize + 3;
  }

  get stringIndicatorY() {
    return this.config.titleY + (this.config.titleFontSize / 2);
  }

  get fingerNumberIndicatorsY() {
    return this.neckY +
    this.config.neckHeight +
    this.config.fingerNumberFontSize +
    (this.config.fingerNumberFontSize / 2);
  }

  get nutThicknessCorrection() {
    return this.config.nutThickness - this.config.fretThickness;
  }

  render(renderer: Renderer) {
    this.renderer = renderer;
    this.renderTitle(renderer);
    this.renderFrets(renderer);
    this.renderStrings(renderer);
    this.renderNut(renderer);
    this.renderOpenStringIndicators(renderer);
    this.renderUnusedStringIndicators(renderer);
    this.renderStringMarkers(renderer);
    this.renderBarres(renderer);
    this.renderFingerNumberIndicators(renderer);
  }

  renderTitle(renderer: Renderer) {
    const { chord } = this.chordDiagramDefinition;

    renderer.text(
      chord,
      {
        fontSize: this.config.titleFontSize,
        x: (this.neckX + (this.config.neckWidth / 2)),
        y: this.config.titleY,
      },
    );
  }

  renderStrings(renderer: Renderer) {
    const { stringCount } = this.chordDiagramDefinition;

    repeat(stringCount, (stringIndex) => {
      renderer.line({
        x1: this.neckX + (stringIndex * (this.config.neckWidth / (stringCount - 1))),
        y1: this.neckY,
        x2: this.neckX + (stringIndex * (this.config.neckWidth / (stringCount - 1))),
        y2: this.neckY + this.config.neckHeight,
        thickness: this.config.stringThickness,
        color: this.config.stringColor,
      });
    });
  }

  renderNut(renderer: Renderer) {
    if (this.chordDiagramDefinition.baseFret === 1) {
      this.renderStandardNut(renderer);
    } else {
      this.renderTransposedNut(renderer);
    }
  }

  private renderTransposedNut(renderer: Renderer) {
    renderer.text(
      this.chordDiagramDefinition.baseFret.toString(),
      {
        fontSize: this.config.baseFretFontSize,
        x: this.neckX - this.config.fretThickness - (this.config.baseFretFontSize * 3),
        y: this.neckY + (this.config.neckHeight / this.chordDiagramDefinition.fretCount),
      },
    );
    renderer.line({
      x1: this.neckX - this.config.fretThickness,
      y1: this.neckY + this.nutThicknessCorrection + 1,
      x2: this.neckX - this.config.fretThickness + this.config.neckWidth + (2 * this.config.fretThickness),
      y2: this.neckY + this.nutThicknessCorrection,
      thickness: this.config.fretThickness,
      color: this.config.nutColor,
    });
  }

  private renderStandardNut(renderer: Renderer) {
    renderer.line({
      x1: this.neckX - this.config.stringThickness,
      y1: this.neckY,
      x2: this.neckX + this.config.neckWidth + this.config.stringThickness,
      y2: this.neckY,
      thickness: this.config.nutThickness,
    });
  }

  renderFrets(renderer: Renderer) {
    const { fretCount } = this.chordDiagramDefinition;
    const fretSpacing = (this.config.neckHeight - this.nutThicknessCorrection) / fretCount;

    repeat(fretCount, (fretIndex) => {
      renderer.line({
        x1: this.neckX - this.config.fretThickness,
        y1: this.neckY + this.nutThicknessCorrection + ((fretIndex + 1) * fretSpacing),
        x2: this.neckX - this.config.fretThickness + this.config.neckWidth + (2 * this.config.fretThickness),
        y2: this.neckY + this.nutThicknessCorrection + ((fretIndex + 1) * fretSpacing),
        thickness: this.config.fretLineThickness,
        color: this.config.fretColor,
      });
    });
  }

  renderOpenStringIndicators(renderer: Renderer) {
    const { openStrings, stringCount } = this.chordDiagramDefinition;

    openStrings.forEach((stringNumber: StringNumber) => {
      renderer.circle({
        size: this.config.stringIndicatorSize,
        x: this.neckX + ((stringNumber - 1) * (this.config.neckWidth / (stringCount - 1))),
        y: this.stringIndicatorY,
        thickness: this.config.openStringIndicatorThickness,
      });
    });
  }

  renderUnusedStringIndicators(renderer: Renderer) {
    const { stringCount, unusedStrings } = this.chordDiagramDefinition;

    unusedStrings.forEach((stringNumber: StringNumber) => {
      const x = this.neckX + ((stringNumber - 1) * (this.config.neckWidth / (stringCount - 1)));
      const y = this.stringIndicatorY;
      const size = this.config.stringIndicatorSize;

      renderer.line({
        x1: x - size / 2,
        y1: y - size / 2,
        x2: x + size / 2,
        y2: y + size / 2,
        thickness: this.config.unusedStringIndicatorThickness,
      });

      renderer.line({
        x1: x + size / 2,
        y1: y - size / 2,
        x2: x - size / 2,
        y2: y + size / 2,
        thickness: this.config.unusedStringIndicatorThickness,
      });
    });
  }

  renderStringMarkers(renderer: Renderer) {
    const { fretCount, markers } = this.chordDiagramDefinition;
    const fretSpacing = (this.config.neckHeight - this.nutThicknessCorrection) / fretCount;

    markers.forEach(({ string, fret }: StringMarker) => {
      renderer.circle({
        x: this.neckX + ((string - 1) * (this.config.neckWidth / 5)),
        y: this.neckY + this.nutThicknessCorrection +
           (fret * fretSpacing) - (fretSpacing / 2) + this.config.fingerIndicatorOffset,
        size: this.config.fingerIndicatorSize,
        fill: true,
        thickness: this.config.markerThickness,
      });
    });
  }

  renderBarres(renderer: Renderer) {
    const { barres, fretCount, stringCount } = this.chordDiagramDefinition;
    const fretSpacing = (this.config.neckHeight - this.nutThicknessCorrection) / fretCount;
    const barreHeight = fretSpacing / 3.0;
    const stringSpacing = this.config.neckWidth / (stringCount - 1);

    barres.forEach(({ from, to, fret }: Barre) => {
      const stringSpaceCount = to - from;

      renderer.rect({
        x: this.neckX + (from - 1.5) * stringSpacing,
        y: this.neckY + this.nutThicknessCorrection + ((fret - 0.5) * fretSpacing) - (barreHeight / 2) +
           this.config.fingerIndicatorOffset,
        width: (stringSpaceCount + 1) * stringSpacing,
        height: barreHeight,
        thickness: this.config.barreThickness,
        radius: 8,
        fill: true,
      });
    });
  }

  renderFingerNumberIndicators(renderer: Renderer) {
    if (!this.config.showFingerNumbers) return;
    const { markers, stringCount } = this.chordDiagramDefinition;
    const stringSpacing = this.config.neckWidth / (stringCount - 1);

    markers.forEach(({ string, finger }: StringMarker) => {
      if (!finger) return;

      renderer.text(
        `${finger}`,
        {
          fontSize: this.config.fingerNumberFontSize,
          x: this.neckX + ((string - 1) * stringSpacing),
          y: this.fingerNumberIndicatorsY,
        },
      );
    });
  }
}

export default ChordDiagram;
