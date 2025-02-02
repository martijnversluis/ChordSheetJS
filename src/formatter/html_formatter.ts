import Formatter from './formatter';
import Configuration, { ConfigurationProperties } from './configuration';
import Song from '../chord_sheet/song';
import { scopeCss } from '../utilities';
import Paragraph from '../chord_sheet/paragraph';

export interface HtmlTemplateCssClasses {
  annotation: string,
  chord: string,
  chordSheet: string,
  column: string,
  comment: string,
  emptyLine: string,
  label: string,
  labelWrapper: string,
  line: string,
  literal: string,
  literalContents: string,
  lyrics: string,
  paragraph: string,
  row: string,
  subtitle: string,
  title: string,
}

export interface HtmlTemplateArgs {
  configuration: Configuration;
  song: Song;
  renderBlankLines?: boolean;
  bodyParagraphs: Paragraph[],
  cssClasses: HtmlTemplateCssClasses,
}

export type Template = (_args: HtmlTemplateArgs) => string;
export type CSS = Record<string, Record<string, string>>;

export const defaultCssClasses: HtmlTemplateCssClasses = {
  annotation: 'annotation',
  chord: 'chord',
  chordSheet: 'chord-sheet',
  column: 'column',
  comment: 'comment',
  emptyLine: 'empty-line',
  label: 'label',
  labelWrapper: 'label-wrapper',
  line: 'line',
  literal: 'literal',
  literalContents: 'contents',
  lyrics: 'lyrics',
  paragraph: 'paragraph',
  row: 'row',
  subtitle: 'subtitle',
  title: 'title',
};

/**
 * Acts as a base class for HTML formatters
 */
abstract class HtmlFormatter extends Formatter {
  cssClasses: HtmlTemplateCssClasses;

  /**
   * Instantiate the formatter. For all options see {@link Formatter}
   * @param {Object} [configuration={}] options
   * @param {object} [configuration.cssClasses={}] CSS classes to use in the HTML output. The default classes are
   * defined in {@link defaultCssClasses}. You can override them by providing your own classes here:
   * @example
   * ```javascript
   * {
   *    cssClasses: {
   *      annotation: 'my-annotation',
   *      chord: 'my-chord',
   *      chordSheet: 'my-chord-sheet',
   *      column: 'my-column',
   *      comment: 'my-comment',
   *      emptyLine: 'my-empty-line',
   *      label: 'my-label',
   *      labelWrapper: 'my-label-wrapper',
   *      line: 'my-line',
   *      literal: 'my-literal',
   *      literalContents: 'my-contents',
   *      lyrics: 'my-lyrics',
   *      paragraph: 'my-paragraph',
   *      row: 'my-row',
   *      subtitle: 'my-subtitle',
   *      title: 'my-title',
   *    }
   *  }
   *  ```
   */
  constructor(configuration: ConfigurationProperties & { cssClasses?: Partial<HtmlTemplateCssClasses> } = {}) {
    super(configuration);
    this.cssClasses = { ...defaultCssClasses, ...configuration.cssClasses };
  }

  /**
   * Formats a song into HTML.
   * @param {Song} song The song to be formatted
   * @returns {string} The HTML string
   */
  format(song: Song): string {
    const { bodyParagraphs, expandedBodyParagraphs } = song;

    return this.template(
      {
        song,
        configuration: this.configuration,
        bodyParagraphs: this.configuration.expandChorusDirective ? expandedBodyParagraphs : bodyParagraphs,
        cssClasses: this.cssClasses,
      },
    );
  }

  /**
   * Generates basic CSS, optionally scoped within the provided selector, to use with the HTML output
   *
   * For example, execute cssString('.chordSheetViewer') will result in CSS like:
   *
   *     .chordSheetViewer .paragraph {
   *       margin-bottom: 1em;
   *     }
   *
   * @param scope the CSS scope to use, for example `.chordSheetViewer`
   * @returns {string} the CSS string
   */
  cssString(scope = ''): string {
    return scopeCss(this.cssObject, scope);
  }

  /**
   * Basic CSS, in object style à la useStyles, to use with the HTML output
   * For a CSS string see {@link cssString}
   *
   * Example:
   *
   *     '.paragraph': {
   *       marginBottom: '1em'
   *     }
   *
   * @return {Object.<string, Object.<string, string>>} the CSS object
   */
  get cssObject(): CSS {
    return this.defaultCss;
  }

  abstract get defaultCss(): CSS;

  abstract get template(): Template;
}

export default HtmlFormatter;
