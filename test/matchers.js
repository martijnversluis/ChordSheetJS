import ChordLyricsPair from '../src/chord_sheet/chord_lyrics_pair';
import Tag from '../src/chord_sheet/tag';

function toBeClassInstanceWithProperties(received, klass, properties) {
  const propertyNames = Object.keys(properties);
  const pass = (received instanceof klass) && propertyNames.every(name => received[name] === properties[name]);
  const stringifiedProperties = propertyNames.map(name => `${name}=${properties[name]}`);

  if (pass) {
    return {
      message: () =>
        `expected ${received} not to be a ${klass.name}(${stringifiedProperties})`,
      pass: true,
    };
  } else {
    return {
      message: () => {
        const errorBase = `expected ${received} to be a ${klass.name}(${stringifiedProperties})`;
        const errors = [];
        const type = typeof(received);

        if (type !== 'object') {
          errors.push(`it was a ${type} with value ${received}`);
        } else if (!(received instanceof klass)) {
          errors.push(`it was a instance of ${received.constructor.name}`);
        } else {
          propertyNames.forEach(name => {
            if (received[name] !== properties[name]) {
              errors.push(`its ${name} were: "${received[name]}"`);
            }
          });
        }

        return `${errorBase}, but ${errors.join(' and ')}`;
      },
      pass: false,
    };
  }
}

function toBeChordLyricsPair (received, chords, lyrics) {
  return toBeClassInstanceWithProperties(received, ChordLyricsPair, { chords, lyrics });
}

function toBeTag (received, name, value) {
  return toBeClassInstanceWithProperties(received, Tag, { name, value });
}

expect.extend({
  toBeChordLyricsPair,
  toBeTag,
});
