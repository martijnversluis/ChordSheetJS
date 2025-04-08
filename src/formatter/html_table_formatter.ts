import HtmlFormatter, { Template, CSS, HtmlTemplateCssClasses } from './html_formatter';
import template from './templates/html_table_formatter';

/* eslint-disable-next-line max-lines-per-function */
function defaultCss(cssClasses: HtmlTemplateCssClasses): CSS {
  const {
    annotation,
    chord,
    comment,
    labelWrapper,
    line,
    literal,
    literalContents,
    lyrics,
    paragraph,
    row,
    subtitle,
    title,
  } = cssClasses;

  return {
    [`.${title}`]: {
      fontSize: '1.5em',
    },
    [`.${subtitle}`]: {
      fontSize: '1.1em',
    },
    [`.${row}, .${line}, .${literal}`]: {
      borderSpacing: '0',
      color: 'inherit',
    },
    [`.${annotation}, .${chord}, .${comment}, .${literalContents}, .${labelWrapper}, .${literal}, .${lyrics}`]: {
      padding: '3px 0',
    },
    [`.${chord}:not(:last-child)`]: {
      paddingRight: '10px',
    },
    [`.${paragraph}`]: {
      marginBottom: '1em',
    },
  };
}

/**
 * Formats a song into HTML. It uses TABLEs to align lyrics with chords, which makes the HTML for things like
 * PDF conversion.
 */
class HtmlTableFormatter extends HtmlFormatter {
  get template(): Template {
    return template;
  }

  get defaultCss(): CSS {
    return defaultCss(this.cssClasses);
  }
}

export default HtmlTableFormatter;
