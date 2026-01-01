import { HtmlTemplateCssClasses } from './configuration';
import template from './templates/html_div_formatter';

import HtmlFormatter, { CSS, Template } from './html_formatter';

function defaultCss(cssClasses: HtmlTemplateCssClasses): CSS {
  const {
    chord,
    lyrics,
    paragraph,
    row,
  } = cssClasses;

  return {
    [`.${chord}:not(:last-child)`]: {
      paddingRight: '10px',
    },

    [`.${paragraph}`]: {
      marginBottom: '1em',
    },

    [`.${row}`]: {
      display: 'flex',
    },

    [`.${chord}:after`]: {
      content: '\'\\200b\'',
    },

    [`.${lyrics}:after`]: {
      content: '\'\\200b\'',
    },
  };
}

/**
 * Formats a song into HTML. It uses DIVs to align lyrics with chords, which makes it useful for responsive web pages.
 */
class HtmlDivFormatter extends HtmlFormatter {
  get template(): Template {
    return template;
  }

  get defaultCss(): CSS {
    return defaultCss(this.configuration.cssClasses);
  }
}

export default HtmlDivFormatter;
