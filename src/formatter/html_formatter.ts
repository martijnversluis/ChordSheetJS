import Formatter from './formatter';
import Configuration from './configuration/configuration';
import Song from '../chord_sheet/song';
import { breakingChange, scopeCss } from '../utilities';

export type HtmlTemplateArgs = {
  configuration: Configuration;
  song: Song;
  renderBlankLines?: boolean;
};

export type Template = (_args: HtmlTemplateArgs) => string;
export type CSS = Record<string, Record<string, string>>;

/**
 * Acts as a base class for HTML formatters
 */
abstract class HtmlFormatter extends Formatter {
  /**
   * Formats a song into HTML.
   * @param {Song} song The song to be formatted
   * @returns {string} The HTML string
   */
  format(song: Song): string {
    return this.template({ song, configuration: this.configuration });
  }

  /**
   * Generates basic CSS, optionally scoped within the provided selector, to use with the HTML output
   * @deprecated
   */
  static cssString(_scope = ''): void {
    breakingChange(
      'The class method cssString() was removed in favor of the instance PROPERTY. '
      + 'Please use `new <Formatter>().cssString` instead.',
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
    return scopeCss(this.defaultCss, scope);
  }

  /**
   * Basic CSS, in object style à la useStyles, to use with the HTML output
   * @deprecated
   */
  static cssObject(): void {
    breakingChange(
      'The class method cssObject() was removed in favor of the instance PROPERTY. '
      + 'Please use `new <Formatter>().cssObject` instead.',
    );
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
