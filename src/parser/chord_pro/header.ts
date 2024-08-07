function buildSection(sectionType, startTag, endTag, content) {
  return [
    buildLine([startTag]),
    ...splitSectionContent(content).map((line) => buildLine([line])),
    buildLine([endTag]),
  ];
}

function buildTag(name, value, location) {
  return {
    type: 'tag',
    name,
    value,
    location: location.start,
  };
}

function buildLine(items) {
  return {
    type: 'line',
    items,
  };
}

function splitSectionContent(content) {
  return content
    .replace(/\n$/, '')
    .split('\n');
}
