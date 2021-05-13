/**
 * Acts as a base class for HTML formatters, taking care of whitelisting prototype property access.
 */
class HtmlFormatter {
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
        },
      },
    );
  }
}

export default HtmlFormatter;
