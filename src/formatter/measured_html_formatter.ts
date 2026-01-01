import { DomMeasurer } from '../layout/measurement';
import { MeasuredHtmlFormatterConfiguration } from './configuration';
import MeasurementBasedFormatter from './measurement_based_formatter';
import PositionedHtmlRenderer from '../rendering/html/positioned_html_renderer';
import Song from '../chord_sheet/song';
import { getMeasuredHtmlDefaultConfig } from './configuration/default_config_manager';
import { LayoutConfig, LayoutEngine } from '../layout/engine';

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

    // Create the layout engine
    const layoutEngine = this.createLayoutEngine();

    // Compute paragraph layouts
    const paragraphLayouts = layoutEngine.computeParagraphLayouts();

    // Render everything with a single call
    this.renderer.render(paragraphLayouts);
  }

  /**
   * Create the layout engine with the appropriate configuration
   */
  // eslint-disable-next-line max-lines-per-function
  private createLayoutEngine(): LayoutEngine {
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
        chord: this.configuration.fonts.chord,
        lyrics: this.configuration.fonts.text,
        comment: this.configuration.fonts.comment,
        sectionLabel: this.configuration.fonts.sectionLabel,
      },
      chordSpacing: this.configuration.layout.sections.global.chordSpacing,
      chordLyricSpacing: this.configuration.layout.sections.global.chordLyricSpacing,
      linePadding: this.configuration.layout.sections.global.linePadding,
      useUnicodeModifiers: this.configuration.useUnicodeModifiers,
      normalizeChords: this.configuration.normalizeChords,

      // Column and page layout information
      minY: dimensions.minY,
      columnWidth: dimensions.columnWidth,
      columnCount: this.configuration.layout.sections.global.columnCount,
      columnSpacing: this.configuration.layout.sections.global.columnSpacing,
      minColumnWidth: this.configuration.layout.sections.global.minColumnWidth,
      maxColumnWidth: this.configuration.layout.sections.global.maxColumnWidth,
      paragraphSpacing: this.configuration.layout.sections.global.paragraphSpacing || 0,
      columnBottomY: this.renderer.getContentBottomY(),
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
