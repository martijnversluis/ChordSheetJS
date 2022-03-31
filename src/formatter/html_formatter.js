import Formatter from './formatter';

/**
 * Acts as a base class for HTML formatters, taking care of whitelisting prototype property access.
 */
class HtmlFormatter extends Formatter {
  formatWithTemplate(song, template) {
    return template(
      { song },
      {
        allowedProtoProperties: {
          bodyLines: true,
          bodyParagraphs: true,
          subtitle: true,
          title: true,
          value: true,
          key: true,
        },
      },
    );
  }
}

export default HtmlFormatter;
