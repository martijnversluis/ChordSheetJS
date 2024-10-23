import print from 'print';

import {
  ChordLyricsPair,
  Comment,
  Literal,
  SoftLineBreak,
  Tag,
  Ternary,
} from '../src';
import StubbedPdfDoc, { RenderedItem, RenderedLine, RenderedText } from './formatter/stubbed_pdf_doc';
import levenshtein from "js-levenshtein";

function typeRepresentation(type, value) {
  if (type === 'object') {
    if (value === null) {
      return 'null';
    }

    return `${value.constructor} object`;
  }

  return value;
}

const anything = {};

function valuesEqual(expected: any, actual: any): boolean {
  if (typeof expected === 'object') {
    if (expected === null) {
      return actual === null;
    }

    if (Array.isArray(expected)) {
      return expected.every((value, index) => valuesEqual(value, actual[index]));
    }

    return Object.keys(expected).every((key) => valuesEqual(expected[key], actual[key]));
  }

  return expected === actual;
}

function getObjectType(object) {
  if (object === null) {
    return 'null';
  }

  if (object === undefined) {
    return 'undefined';
  }

  if ('constructor' in object) {
    return `an instance of ${object.constructor.name}`;
  }

  return `${object} (${typeof object})`;
}

function toBeClassInstanceWithProperties(received, klass, properties) {
  const propertyNames = Object.keys(properties);
  const pass = (!klass || received instanceof klass) &&
    propertyNames.every((name) => valuesEqual(properties[name], received[name]));
  const stringifiedProperties = propertyNames.map((name) => `${name}=${properties[name]}`);

  if (pass) {
    return {
      message: () => `expected ${received} not to be a ${klass.name}(${stringifiedProperties})`,
      pass: true,
    };
  }

  return {
    message: () => {
      const errorBase = `expected ${received} to be a ${klass?.name || 'object'}(${stringifiedProperties})`;
      const errors: string[] = [];
      const type = typeof received;

      if (type !== 'object') {
        errors.push(`it was a ${type} with value ${received}`);
      } else if (klass && !(received instanceof klass)) {
        errors.push(`it was ${getObjectType(received)}`);
      } else {
        propertyNames.forEach((name) => {
          const actualProperty = received[name];
          const expectedProperty = properties[name];
          const actualType = typeof actualProperty;
          const expectedType = typeof expectedProperty;

          if (expectedType === anything) {
            return;
          }

          const expectedRepr = typeRepresentation(expectedType, expectedProperty);
          const actualRepr = typeRepresentation(actualType, actualProperty);

          if (actualType !== expectedType) {
            errors.push(
              `expected ${name} to be a ${expectedRepr} 
               but it was a ${actualRepr}`,
            );
          } else if (!valuesEqual(expectedProperty, actualProperty)) {
            errors.push(`its ${name} value was: ${print(actualProperty)} vs ${print(expectedProperty)}`);
          }
        });
      }

      return `${errorBase}, but ${errors.join(' and ')}`;
    },
    pass: false,
  };
}

function toBeChordLyricsPair(received, chords, lyrics, annotation = '') {
  return toBeClassInstanceWithProperties(received, ChordLyricsPair, { chords, lyrics, annotation });
}

function toBeTag(received, name, value = '') {
  return toBeClassInstanceWithProperties(received, Tag, { name, value });
}

function toBeComment(received, content) {
  return toBeClassInstanceWithProperties(received, Comment, { content });
}

function toBeTernary(received, properties) {
  return toBeClassInstanceWithProperties(received, Ternary, properties);
}

function toBeLiteral(received, string) {
  return toBeClassInstanceWithProperties(received, Literal, { string });
}

function toBeKey(received, { note, modifier, minor = false }) {
  return toBeClassInstanceWithProperties(
    {
      note: received.note.note,
      modifier: received.modifier,
      minor: received.minor,
    },
    null,
    { note, modifier, minor },
  );
}

function toBeNote(received, { note, type, minor = false }) {
  return toBeClassInstanceWithProperties(
    {
      note: received.note,
      type: received.type,
      minor: received.minor,
    },
    null,
    { note, type, minor },
  );
}

function toBeSoftLineBreak(received) {
  return toBeClassInstanceWithProperties(received, SoftLineBreak, {});
}

function hasText(doc: StubbedPdfDoc, text: string, x: number, y: number) {
  return doc.renderedItems.some((item: RenderedItem) => {
    if (item.type !== 'text') return false;
    const textItem = item as RenderedText;
    return textItem.text === text && textItem.x === x && textItem.y === y;
  });
}

function findTextMatch(doc: StubbedPdfDoc, text: string, x: number, y: number, distanceMargin = 50) {
  const textItems =
    doc.renderedItems
      .filter((item: RenderedItem) => item.type === 'text')
      .map((item: RenderedItem) => item as RenderedText);

  const candidates = textItems
    // eslint-disable-next-line arrow-body-style
    .filter((item: RenderedText) => {
      // eslint-disable-next-line max-len
      return item.x >= x - distanceMargin && item.x <= x + distanceMargin && item.y >= y - distanceMargin && item.y <= y + distanceMargin;
    })
    .sort((a, b) => {
      const aDistance = levenshtein(a.text, text);
      const bDistance = levenshtein(b.text, text);

      if (aDistance !== bDistance) {
        return aDistance - bDistance;
      }

      const aYDistance = Math.abs(a.y - y);
      const bYDistance = Math.abs(b.y - y);

      if (aYDistance !== bYDistance) {
        return aYDistance - bYDistance;
      }

      const aXDistance = Math.abs(a.x - x);
      const bXDistance = Math.abs(b.x - x);

      return aXDistance - bXDistance;
    });

  return candidates[0];
}

function toHaveText(received: StubbedPdfDoc, text: string, x: number, y: number) {
  const pass = hasText(received, text, x, y);

  if (pass) {
    return {
      message: () => `expected ${received} not to have text "${text}" at (${x}, ${y})`,
      pass: true,
    };
  }

  return {
    message: () => [
      `expected ${received} to have text "${text}" at (${x}, ${y}), `,
      `but it was not found. Closest match was ${print(findTextMatch(received, text, x, y))}`
    ].join(''),
    pass: false,
  };
}

function toHaveLine(received: StubbedPdfDoc, x1, y1, x2, y2) {
  const match = received.renderedItems.find((item: RenderedItem) => {
    if (item.type !== 'line') return false;
    const line = item as RenderedLine;
    return line.x1 === x1 && line.y1 === y1 && line.x2 === x2 && line.y2 === y2;
  });

  if (match) {
    return {
      message: () => `expected ${received} not to have a line from (${x1}, ${y1}) to (${x2}, ${y2})`,
      pass: true,
    };
  }

  const allLines =
    received.renderedItems
      .filter((item: RenderedItem) => item.type === 'line')
      .map((item: RenderedItem) => item as RenderedLine)
      .map((line: RenderedLine) => `- (${line.x1}, ${line.y1}) to (${line.x2}, ${line.y2})`)
      .join('\n');

  return {
    message: () => [
      `expected ${received} to have a line from (${x1}, ${y1}) to (${x2}, ${y2}), but it was not found.`,
      `All lines: \n${allLines}`,
    ].join('\n'),
    pass: false,
  };
}

// eslint-disable-next-line no-undef
expect.extend({
  toBeChordLyricsPair,
  toBeComment,
  toBeKey,
  toBeLiteral,
  toBeNote,
  toBeSoftLineBreak,
  toBeTag,
  toBeTernary,
  toHaveText,
  toHaveLine,
});
