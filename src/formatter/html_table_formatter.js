import Handlebars from 'handlebars';

import '../handlebars_helpers';
import HtmlFormatter from './html_formatter';
import './templates/html_table_formatter.js';

const { html_table_formatter: template } = Handlebars.templates;

/**
 * Formats a song into HTML. It uses TABLEs to align lyrics with chords, which makes the HTML for things like
 * PDF conversion.
 */
class HtmlTableFormatter extends HtmlFormatter {
  /**
   * Formats a song into HTML.
   * @param {Song} song The song to be formatted
   * @returns {string} The HTML string
   */
  format(song) {
    return this.formatWithTemplate(song, template);
  }
}

export default HtmlTableFormatter;
