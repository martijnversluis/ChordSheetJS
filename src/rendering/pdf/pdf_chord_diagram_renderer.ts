import DocWrapper from '../../formatter/pdf_formatter/doc_wrapper';
import JsPDFDiagramRenderer from '../../chord_diagram/js_pdf_renderer';
import Song from '../../chord_sheet/song';

import ChordDefinition, { isNonSoundingString, isOpenFret } from '../../chord_definition/chord_definition';
import ChordDiagram, { Barre, ChordDiagramRenderingConfig, StringMarker } from '../../chord_diagram/chord_diagram';

import { ChordDiagramFontConfigurations } from '../../formatter/configuration';

import {
  FingerNumber, Fret, FretNumber, StringNumber,
} from '../../constants';

/**
 * Context for chord diagram rendering
 */
export interface ChordDiagramRenderingContext {
  song: Song;
  doc: DocWrapper;
  getMinY: () => number;
  getColumnStartX: () => number;
  getColumnBottomY: () => number;
  moveToNextColumn: () => void;
  dimensions: { columnWidth: number };
  getX: () => number;
  getY: () => number;
  getCurrentColumn: () => number;
  getCurrentPage: () => number;
  setPosition: (x: number, y: number, column: number, page: number) => void;
}

/**
 * Configuration for chord diagram rendering
 */
export interface ChordDiagramConfig {
  enabled: boolean;
  renderingConfig?: ChordDiagramRenderingConfig;
  fonts: ChordDiagramFontConfigurations;
  overrides?: {
    global?: Record<string, { hide?: boolean; definition?: string }>;
    byKey?: Record<string, Record<string, { hide?: boolean; definition?: string }>>;
  };
}

/**
 * Handles chord diagram rendering for PDF output.
 * Extracted from JsPdfRenderer to improve modularity.
 */
export class ChordDiagramRenderer {
  private context: ChordDiagramRenderingContext;

  private config: ChordDiagramConfig;

  constructor(context: ChordDiagramRenderingContext, config: ChordDiagramConfig) {
    this.context = context;
    this.config = config;
  }

  /**
   * Renders all chord diagrams for the song
   */
  render(): void {
    if (!this.config.enabled) return;

    const overrides = this.config.overrides || { global: {}, byKey: {} };
    const layout = this.calculateDiagramLayout();
    this.initializeDiagramPosition(layout.height);

    let diagramsInRow = 0;
    const songKey = this.context.song.key || 0;

    this.getChordDefinitions().forEach((def: ChordDefinition) => {
      const result = this.renderSingleChordDiagram(def, songKey, overrides, layout, diagramsInRow);
      if (result !== null) diagramsInRow = result;
    });
  }

  /**
   * Calculates layout dimensions for chord diagrams
   */
  private calculateDiagramLayout(): { width: number; height: number; spacing: number; perRow: number } {
    const { renderingConfig } = this.config;
    const spacing = renderingConfig?.diagramSpacing || 7;
    const maxPerRow = renderingConfig?.maxDiagramsPerRow || null;
    const { columnWidth } = this.context.dimensions;

    const minWidth = 30;
    const maxWidth = 35;
    const potentialPerRow = Math.floor(columnWidth / (minWidth + spacing));
    const perRow = maxPerRow ? Math.min(maxPerRow, potentialPerRow) : potentialPerRow;
    const totalSpacing = (perRow - 1) * spacing;
    const width = Math.max(minWidth, Math.min(maxWidth, (columnWidth - totalSpacing) / perRow));
    const height = JsPDFDiagramRenderer.calculateHeight(width);

    return {
      width, height, spacing, perRow,
    };
  }

  /**
   * Initializes position for diagram rendering
   */
  private initializeDiagramPosition(height: number): void {
    let x = this.context.getX();
    let y = this.context.getY();
    let currentColumn = this.context.getCurrentColumn();

    if (y === this.context.getMinY() && this.context.getCurrentPage() > 1) {
      currentColumn = 1;
      x = this.context.getColumnStartX();
    }
    if (y + height > this.context.getColumnBottomY()) {
      this.context.moveToNextColumn();
      y = this.context.getMinY();
      x = this.context.getColumnStartX();
      currentColumn = this.context.getCurrentColumn();
    }

    this.context.setPosition(x, y, currentColumn, this.context.getCurrentPage());
  }

  /**
   * Renders a single chord diagram
   */
  private renderSingleChordDiagram(
    chordDef: ChordDefinition,
    songKey: any,
    overrides: any,
    layout: { width: number; height: number; spacing: number; perRow: number },
    diagramsInRow: number,
  ): number | null {
    const { shouldHide, customDefinition } = this.processChordOverrides(chordDef.name, songKey, overrides);
    if (shouldHide) return null;

    const definition = customDefinition ? ChordDefinition.parse(customDefinition) : chordDef;
    const newRowCount = this.positionForNextDiagram(layout, diagramsInRow);

    this.drawChordDiagram(definition, layout.width, layout.spacing);
    return newRowCount + 1;
  }

  /**
   * Positions for the next diagram, handling row and column breaks
   */
  private positionForNextDiagram(
    layout: { width: number; height: number; spacing: number; perRow: number },
    diagramsInRow: number,
  ): number {
    let { count, x, y } = this.getInitialPosition(diagramsInRow);
    ({ count, x, y } = this.handleRowBreak(layout, count, x, y));
    ({ count, x, y } = this.handleColumnBreak(layout, count, x, y));
    this.context.setPosition(x, y, this.context.getCurrentColumn(), this.context.getCurrentPage());
    return count;
  }

  private getInitialPosition(diagramsInRow: number): { count: number; x: number; y: number } {
    return { count: diagramsInRow, x: this.context.getX(), y: this.context.getY() };
  }

  private handleRowBreak(
    layout: { width: number; height: number; spacing: number; perRow: number },
    count: number,
    x: number,
    y: number,
  ): { count: number; x: number; y: number } {
    const { columnWidth } = this.context.dimensions;
    const columnStartX = this.context.getColumnStartX();
    const needsRowBreak = count >= layout.perRow || x + layout.width > columnStartX + columnWidth;
    if (needsRowBreak) {
      return { count: 0, x: this.context.getColumnStartX(), y: y + layout.height + layout.spacing };
    }
    return { count, x, y };
  }

  private handleColumnBreak(
    layout: { width: number; height: number; spacing: number; perRow: number },
    count: number,
    x: number,
    y: number,
  ): { count: number; x: number; y: number } {
    if (y + layout.height > this.context.getColumnBottomY()) {
      this.context.moveToNextColumn();
      return { count: 0, x: this.context.getColumnStartX(), y: this.context.getMinY() };
    }
    return { count, x, y };
  }

  /**
   * Draws a single chord diagram
   */
  private drawChordDiagram(definition: ChordDefinition, width: number, spacing: number): void {
    const { fonts } = this.config;
    const diagram = this.buildChordDiagram(definition);
    const x = this.context.getX();
    const y = this.context.getY();
    const renderer = new JsPDFDiagramRenderer(this.context.doc, {
      x, y, width, fonts,
    });
    diagram.render(renderer);

    const newX = x + width + spacing;
    this.context.setPosition(newX, y, this.context.getCurrentColumn(), this.context.getCurrentPage());
  }

  /**
   * Processes chord overrides from configuration
   */
  private processChordOverrides(
    chordName: string,
    songKey: number | string,
    overrides: any,
  ): { shouldHide: boolean; customDefinition: string | null } {
    const keyOverride = overrides?.byKey?.[songKey]?.[chordName];
    if (keyOverride) return this.extractOverrideValues(keyOverride);

    const globalOverride = overrides?.global?.[chordName];
    if (globalOverride) return this.extractOverrideValues(globalOverride);

    return { shouldHide: false, customDefinition: null };
  }

  /**
   * Extracts override values from configuration
   */
  private extractOverrideValues(override: any): { shouldHide: boolean; customDefinition: string | null } {
    return {
      shouldHide: override.hide ?? false,
      customDefinition: override.definition ?? null,
    };
  }

  /**
   * Gets chord definitions from the song
   */
  private getChordDefinitions(): ChordDefinition[] {
    const chordDefinitions = this.context.song.chordDefinitions.withDefaults();

    return this.context.song
      .getChords()
      .map((chord) => chordDefinitions.get(chord))
      .filter((chordDefinition) => chordDefinition !== null);
  }

  /**
   * Builds a chord diagram from a chord definition
   */
  private buildChordDiagram(chordDefinition: ChordDefinition): ChordDiagram {
    const openStrings = chordDefinition.frets
      .map((fret: Fret, index: number) => (isOpenFret(fret) ? (index + 1) as StringNumber : null))
      .filter((stringNumber: StringNumber | null) => stringNumber !== null);

    const unusedStrings = chordDefinition.frets
      .map((fret: Fret, index: number) => (isNonSoundingString(fret) ? (index + 1) as StringNumber : null))
      .filter((stringNumber: StringNumber | null) => stringNumber !== null);

    const markers: StringMarker[] = [];
    const barres: Barre[] = [];

    this.processFingeringAndBarres(chordDefinition, markers, barres);

    const finalMarkers = markers.filter((marker) => (
      !barres.some((barre) => marker.string >= barre.from && marker.string <= barre.to && marker.fret === barre.fret)
    ));

    const { renderingConfig } = this.config;

    return new ChordDiagram({
      chord: chordDefinition.name,
      openStrings,
      unusedStrings,
      markers: finalMarkers,
      barres,
      baseFret: chordDefinition.baseFret,
    }, renderingConfig);
  }

  /**
   * Processes fingering information and identifies barres
   */
  private processFingeringAndBarres(
    chordDefinition: ChordDefinition,
    markers: StringMarker[],
    barres: Barre[],
  ): void {
    if (!chordDefinition.fingers || chordDefinition.fingers.length === 0) {
      this.addMarkersWithoutFingering(chordDefinition.frets, markers);
      return;
    }

    const fretFingerGroups = this.groupFretsByFinger(chordDefinition);
    this.processFretFingerGroups(fretFingerGroups, markers, barres);
  }

  /**
   * Adds markers without fingering information
   */
  private addMarkersWithoutFingering(frets: Fret[], markers: StringMarker[]): void {
    frets.forEach((fret: Fret, index: number) => {
      if (!isNonSoundingString(fret) && !isOpenFret(fret)) {
        markers.push({ string: (index + 1) as StringNumber, fret, finger: 0 });
      }
    });
  }

  /**
   * Groups frets by finger for barre detection
   */
  private groupFretsByFinger(chordDefinition: ChordDefinition): Record<number, Record<number, number[]>> {
    const groups: Record<number, Record<number, number[]>> = {};

    chordDefinition.frets.forEach((fret: Fret, index: number) => {
      if (isNonSoundingString(fret) || isOpenFret(fret)) return;

      const finger = chordDefinition.fingers[index] || 0;
      if (finger === 0) return;

      const fretNum = fret as number;
      groups[fretNum] = groups[fretNum] || {};
      groups[fretNum][finger] = groups[fretNum][finger] || [];
      groups[fretNum][finger].push((index + 1) as StringNumber);
    });

    return groups;
  }

  /**
   * Processes grouped frets/fingers into markers and barres
   */
  private processFretFingerGroups(
    groups: Record<number, Record<number, number[]>>,
    markers: StringMarker[],
    barres: Barre[],
  ): void {
    Object.entries(groups).forEach(([fretStr, fingers]) => {
      const fret = parseInt(fretStr, 10) as FretNumber;
      Object.entries(fingers).forEach(([fingerStr, strings]) => {
        this.processFingerGroup(fret, parseInt(fingerStr, 10) as FingerNumber, strings, markers, barres);
      });
    });
  }

  /**
   * Processes a single finger group into either a marker or barre
   */
  private processFingerGroup(
    fret: FretNumber,
    finger: FingerNumber,
    strings: number[],
    markers: StringMarker[],
    barres: Barre[],
  ): void {
    if (strings.length > 1) {
      this.addBarreIfValid(fret, strings, barres);
    } else {
      markers.push({ string: strings[0] as StringNumber, fret: fret as number, finger });
    }
  }

  /**
   * Adds a barre if string positions are valid
   */
  private addBarreIfValid(fret: FretNumber, strings: number[], barres: Barre[]): void {
    strings.sort((a, b) => a - b);
    const from = strings[0] as StringNumber;
    const to = strings[strings.length - 1] as StringNumber;

    if (from >= 1 && from <= 6 && to >= 1 && to <= 6 && from <= to) {
      barres.push({ from, to, fret });
    }
  }
}

export default ChordDiagramRenderer;
