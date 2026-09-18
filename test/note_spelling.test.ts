import {
  keyToPitchClass,
  pitchClassToKey,
  scaleDegreeBetween,
  spellPitchForScaleDegree,
} from '../src/note_spelling';

import {
  FLAT, NO_ACCIDENTAL, SOLFEGE, SYMBOL,
} from '../src/constants';

describe('note spelling', () => {
  it('converts note names and pitch classes through the generated scale tables', () => {
    expect(keyToPitchClass('B', NO_ACCIDENTAL, SYMBOL, false)).toEqual(11);
    expect(keyToPitchClass('H', NO_ACCIDENTAL, SYMBOL, false)).toEqual(11);
    expect(pitchClassToKey({
      type: SYMBOL,
      accidental: FLAT,
      preferredAccidental: null,
      pitchClass: 11,
      minor: false,
    })).toEqual('Cb');
  });

  it.each([
    ['Gb', 'Cb', SYMBOL, 4],
    ['Solb', 'Dob', SOLFEGE, 4],
    ['B', 'C', SYMBOL, 2],
  ] as const)('derives the degree from generated note order: %s to %s', (context, spelling, type, expected) => {
    expect(scaleDegreeBetween(context, spelling, type)).toEqual(expected);
  });

  it.each([
    ['C#', 3, 5, SYMBOL, 'E#'],
    ['Gb', 4, 11, SYMBOL, 'Cb'],
    ['Do#', 3, 5, SOLFEGE, 'Mi#'],
    ['Solb', 4, 11, SOLFEGE, 'Dob'],
  ] as const)(
    'spells %s degree %i at pitch class %i in %s as %s',
    (context, degree, pitchClass, type, expected) => {
      expect(spellPitchForScaleDegree({
        context, degree, pitchClass, type,
      })).toEqual(expected);
    },
  );

  it('returns no spelling when the requested degree needs a double accidental', () => {
    expect(spellPitchForScaleDegree({
      context: 'Gb',
      degree: 3,
      pitchClass: 9,
      type: SYMBOL,
    })).toBeNull();
  });
});
