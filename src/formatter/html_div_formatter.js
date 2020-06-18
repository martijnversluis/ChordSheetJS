import Handlebars from 'handlebars';

import '../handlebars_helpers';
import HtmlFormatter from './html_formatter';
import './templates/html_div_formatter.js';

const template = Handlebars.templates['html_div_formatter'];

/**
 * Formats a song into HTML. It uses DIVs to align lyrics with chords, which makes it useful for responsive web pages.
 */
class HtmlDivFormatter extends HtmlFormatter {
  /**
   * Formats a song into HTML.
   * @param {Song} song The song to be formatted
   * @returns {string} The HTML string
   */
  format(song) {
    return this.formatWithTemplate(song, template);
  }
}

export default HtmlDivFormatter;
