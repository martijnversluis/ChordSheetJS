import { DomMeasurer } from '../layout/measurement';
import MeasurementBasedFormatter from './measurement_based_formatter';
import PositionedHtmlRenderer from '../rendering/html/positioned_html_renderer';
import Song from '../chord_sheet/song';
import { getMeasuredHtmlDefaultConfig } from './configuration/default_config_manager';
import { LayoutConfig, LayoutEngine, layoutNeedsTotalPageAwareAutoHeight } from '../layout/engine';
import { MeasuredHtmlFormatterConfiguration, resolveFontConfiguration } from './configuration';

declare type HTMLElement = any;

/**
 * MeasuredHtmlFormatter formats a song into HTML with absolute positioning.
 */
class MeasuredHtmlFormatter extends MeasurementBasedFormatter<MeasuredHtmlFormatterConfiguration> {
  private song: Song = new Song();

  private renderer: PositionedHtmlRenderer | null = null;

  private readonly container: HTMLElement;

  /**
   * Creates a new HTML formatter
   * @param container The HTML container element to render into
   */
  constructor(container: HTMLElement) {
    super();
    this.container = container;
  }

  /**
   * Get the default configuration for HTML formatter
   */
  protected getDefaultConfiguration(): MeasuredHtmlFormatterConfiguration {
    return getMeasuredHtmlDefaultConfig();
  }

  /**
   * Formats a song into HTML with absolute positioning.
   * @param song - The song to format.
   */
  format(song: Song): void {
    this.song = song;

    // Clear the container
    while (this.container.firstChild) {
      this.container.removeChild(this.container.firstChild);
    }

    // Create the HTML renderer
    this.renderer = new PositionedHtmlRenderer(
      song,
      this.container,
      this.configuration,
    );

    // Initialize the renderer
    this.renderer.initialize();

    const layoutResult = this.computePageAwareParagraphLayouts();

    // Render everything with a single call
    this.renderer.render(layoutResult.layouts, { totalPages: layoutResult.totalPages });
  }

  private computeParagraphLayouts(totalPages?: number) {
    const layoutEngine = this.createLayoutEngine(totalPages);
    const layouts = layoutEngine.computeParagraphLayouts();

    return {
      layouts,
      totalPages: layoutEngine.getComputedPageCount(),
    };
  }

  private computePageAwareParagraphLayouts() {
    let result = this.computeParagraphLayouts();

    if (!layoutNeedsTotalPageAwareAutoHeight(this.configuration.layout)) {
      return result;
    }

    for (let i = 0; i < 3; i += 1) {
      const nextResult = this.computeParagraphLayouts(result.totalPages);
      if (nextResult.totalPages === result.totalPages) {
        return nextResult;
      }
      result = nextResult;
    }

    return result;
  }

  /**
   * Create the layout engine with the appropriate configuration
   */
  // eslint-disable-next-line max-lines-per-function
  private createLayoutEngine(totalPages = Number.MAX_SAFE_INTEGER): LayoutEngine {
    if (!this.renderer) {
      throw new Error('Renderer not initialized');
    }

    // Get dimensions and metadata from the renderer
    const rendererMetadata = this.renderer.getDocumentMetadata();
    const { dimensions } = rendererMetadata;

    // Create the layout configuration
    const layoutConfig: LayoutConfig = {
      width: dimensions.columnWidth,
      fonts: {
        chord: resolveFontConfiguration(this.configuration.fonts, 'chord'),
        rhythmSymbol: resolveFontConfiguration(this.configuration.fonts, 'rhythmSymbol'),
        barline: resolveFontConfiguration(this.configuration.fonts, 'barline'),
        instruction: resolveFontConfiguration(this.configuration.fonts, 'instruction'),
        noChord: resolveFontConfiguration(this.configuration.fonts, 'noChord'),
        annotation: resolveFontConfiguration(this.configuration.fonts, 'annotation'),
        lyrics: resolveFontConfiguration(this.configuration.fonts, 'text'),
        comment: this.configuration.fonts.comment,
        sectionLabel: this.configuration.fonts.sectionLabel,
      },
      chordSpacing: this.configuration.layout.sections.global.chordSpacing,
      chordLyricSpacing: this.configuration.layout.sections.global.chordLyricSpacing,
      linePadding: this.configuration.layout.sections.global.linePadding,
      useUnicodeModifiers: this.configuration.useUnicodeModifiers,
      normalizeChords: this.configuration.normalizeChords,
      normalizeChordSuffix: this.configuration.normalizeChordSuffix,

      // Column and page layout information
      totalPages,
      minY: this.renderer.getContentStartY(1, totalPages),
      getMinYForPage: (page, pages) => this.renderer!.getContentStartY(page, pages),
      columnWidth: dimensions.columnWidth,
      columnCount: this.configuration.layout.sections.global.columnCount,
      columnSpacing: this.configuration.layout.sections.global.columnSpacing,
      minColumnWidth: this.configuration.layout.sections.global.minColumnWidth,
      maxColumnWidth: this.configuration.layout.sections.global.maxColumnWidth,
      paragraphSpacing: this.configuration.layout.sections.global.paragraphSpacing || 0,
      columnBottomY: this.renderer.getContentBottomY(1, totalPages),
      getColumnBottomYForPage: (page, pages) => this.renderer!.getContentBottomY(page, pages),
      displayLyricsOnly: !!this.configuration.layout.sections?.base?.display?.lyricsOnly,
      decapo: this.configuration.decapo,
      repeatedSections: this.configuration.layout.sections?.base?.display?.repeatedSections,
    };

    // Return the layout engine
    return new LayoutEngine(
      this.song,
      new DomMeasurer(),
      layoutConfig,
    );
  }

  /**
   * Gets the HTML output
   */
  getHTML(): HTMLElement {
    if (!this.renderer) {
      throw new Error('Renderer not initialized');
    }
    return this.renderer.getHTML();
  }

  /**
   * Generates HTML as a string
   */
  getHTMLString(): string {
    if (!this.renderer) {
      throw new Error('Renderer not initialized');
    }
    return this.renderer.getHTML().outerHTML;
  }

  /**
   * Clean up resources when the formatter is no longer needed
   */
  dispose(): void {
    if (this.renderer) {
      this.renderer.dispose();
      this.renderer = null;
    }
  }
}

export default MeasuredHtmlFormatter;
