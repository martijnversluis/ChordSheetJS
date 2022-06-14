import {
  ChordLyricsPair,
  Tag,
  Comment,
  Ternary,
  Literal,
} from '../src';

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

function toBeClassInstanceWithProperties(received, klass, properties) {
  const propertyNames = Object.keys(properties);
  const pass = (!klass || received instanceof klass)
    && propertyNames.every((name) => received[name] === properties[name]);
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
      const errors = [];
      const type = typeof received;

      if (type !== 'object') {
        errors.push(`it was a ${type} with value ${received}`);
      } else if (klass && !(received instanceof klass)) {
        errors.push(`it was a instance of ${received.constructor.name}`);
      } else {
        propertyNames.forEach((name) => {
          const actualProperty = received[name];
          const expectedProperty = properties[name];
          const actualType = typeof actualProperty;
          const expectedType = typeof expectedProperty;

          if (expectedType === anything) {
            return;
          }

          if (actualType !== expectedType) {
            errors.push(
              `expected ${name} to be a ${typeRepresentation(expectedType, expectedProperty)} 
               but it was a ${typeRepresentation(actualType, actualProperty)}`,
            );
          } else if (actualProperty !== expectedProperty) {
            errors.push(`its ${name} value was: "${actualProperty}" vs "${expectedProperty}"`);
          }
        });
      }

      return `${errorBase}, but ${errors.join(' and ')}`;
    },
    pass: false,
  };
}

function toBeChordLyricsPair(received, chords, lyrics) {
  return toBeClassInstanceWithProperties(received, ChordLyricsPair, { chords, lyrics });
}

function toBeTag(received, name, value) {
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

function toBeChord(
  received,
  {
    base = anything,
    modifier = anything,
    suffix = anything,
    bassBase = anything,
    bassModifier = anything,
  },
) {
  return toBeClassInstanceWithProperties(
    {
      base: received.root.note.note,
      modifier: received.root.modifier,
      suffix: received.suffix,
      bassBase: received.bass?.note?.note || null,
      bassModifier: received.bass?.modifier || null,
    },
    null,
    {
      base, modifier, suffix, bassBase, bassModifier,
    },
  );
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

expect.extend({
  toBeChordLyricsPair,
  toBeTag,
  toBeComment,
  toBeTernary,
  toBeLiteral,
  toBeChord,
  toBeKey,
  toBeNote,
});
