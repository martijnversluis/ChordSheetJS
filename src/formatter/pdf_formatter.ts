import { Blob } from 'buffer';
import JsPDF from 'jspdf';

import DocWrapper from './pdf_formatter/doc_wrapper';
import { JsPdfMeasurer } from '../index';
import JsPdfRenderer from '../rendering/pdf/js_pdf_renderer';
import MeasurementBasedFormatter from './measurement_based_formatter';
import { PDFFormatterConfiguration } from './configuration';
import { PdfConstructor } from './pdf_formatter/types';
import Song from '../chord_sheet/song';
import { getPDFDefaultConfig } from './configuration';
import { LayoutConfig, LayoutEngine } from '../layout/engine';

/**
 * PdfFormatter formats a song into a PDF document.
 */
class PdfFormatter extends MeasurementBasedFormatter<PDFFormatterConfiguration> {
  private song: Song = new Song();

  private renderer: JsPdfRenderer | null = null;

  /**
   * Get the default configuration for PDF formatter
   */
  protected getDefaultConfiguration(): PDFFormatterConfiguration {
    return getPDFDefaultConfig();
  }

  /**
   * Formats a song into a PDF.
   * @param song - The song to format.
   * @param docConstructor - The PDF document constructor.
   */
  format(
    song: Song,
    docConstructor: PdfConstructor = JsPDF,
  ): void {
    this.song = song;

    // Create the PDF renderer
    this.renderer = new JsPdfRenderer(
      song,
      docConstructor,
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
      columnSpacing: this.configuration.layout.sections.global.columnSpacing,
      minColumnWidth: this.configuration.layout.sections.global.minColumnWidth,
      maxColumnWidth: this.configuration.layout.sections.global.maxColumnWidth,
      paragraphSpacing: this.configuration.layout.sections.global.paragraphSpacing || 0,
      columnBottomY: this.renderer.getContentBottomY(),
      displayLyricsOnly: !!this.configuration.layout.sections?.base?.display?.lyricsOnly,
      decapo: this.configuration.decapo,
      repeatedSections: this.configuration.layout.sections?.base?.display?.repeatedSections,
    };

    if (this.configuration.layout.sections.global.columnCount) {
      layoutConfig.columnCount = this.configuration.layout.sections.global.columnCount;
    }

    // Return the layout engine
    return new LayoutEngine(
      this.song,
      new JsPdfMeasurer(this.renderer.getDoc()),
      layoutConfig,
    );
  }

  /**
   * Save the formatted document as a PDF file
   */
  save(): void {
    if (this.renderer) {
      this.renderer.save(`${this.song.title || 'untitled'}.pdf`);
    }
  }

  /**
   * Generate the PDF as a Blob object
   */
  async generatePDF(): Promise<Blob> {
    if (this.renderer) {
      return this.renderer.generatePDF();
    }
    throw new Error('Renderer not initialized');
  }

  /**
   * Get the document wrapper - primarily for testing purposes.
   */
  getDocumentWrapper(): DocWrapper {
    if (!this.renderer) {
      throw new Error('Renderer not initialized');
    }
    return this.renderer.doc;
  }
}

export default PdfFormatter;
