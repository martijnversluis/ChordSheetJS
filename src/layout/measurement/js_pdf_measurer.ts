import DocWrapper from '../../formatter/pdf_formatter/doc_wrapper';
import { FontConfiguration } from '../../formatter/configuration';
import { BaseMeasurer, TextDimensions } from './measurer';

/**
 * Measures text using jsPDF
 */
export class JsPdfMeasurer extends BaseMeasurer {
  constructor(private doc: DocWrapper) {
    super();
  }

  measureText(text: string, fontConfig: FontConfiguration): TextDimensions {
    let result: TextDimensions;

    this.doc.withFontConfiguration(fontConfig, () => {
      const dimensions = this.doc.getTextDimensions(text);
      result = {
        width: dimensions.w,
        height: dimensions.h,
      };
    });

    return result!;
  }

  splitTextToSize(text: string, maxWidth: number, fontConfig: FontConfiguration) {
    let lines: string[] = [];

    this.doc.withFontConfiguration(fontConfig, () => {
      lines = this.doc.splitTextToSize(text, maxWidth);
    });

    return lines;
  }
}
