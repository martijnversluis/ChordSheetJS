import { breakChordLyricsPairOnSoftLineBreak, stringSplitReplace } from '../../../src/parser/chord_pro/helpers';
import { SerializedChordLyricsPair, SerializedSoftLineBreak } from '../../../src/serialized_types';

describe('stringSplitReplace', () => {
  it('should replace all instances of a match', () => {
    const testString = 'I am a barber';

    const result =
      stringSplitReplace(
        testString,
        'a',
        (_match) => 'BREAK',
      );

    expect(result).toEqual(['I ', 'BREAK', 'm ', 'BREAK', ' b', 'BREAK', 'rber']);
  });

  it('should replace all instances of a match and the rest of the string', () => {
    const testString = 'ai am a barber';

    const result =
      stringSplitReplace(
        testString,
        'a',
        (_match) => 'BREAK',
        (match) => match.toUpperCase(),
      );

    expect(result).toEqual(['BREAK', 'I ', 'BREAK', 'M ', 'BREAK', ' B', 'BREAK', 'RBER']);
  });
});

describe('breakChordLyricsPairOnSoftLineBreak', () => {
  it('supports breaking a pair\'s lyrics on a soft line break', () => {
    const chords = 'D/A';
    const lyrics = 'I am \xA0a barber';
    const items: (SerializedChordLyricsPair | SerializedSoftLineBreak)[] =
      breakChordLyricsPairOnSoftLineBreak(chords, lyrics);

    expect(items[0]).toEqual({ type: 'chordLyricsPair', chords: 'D/A', lyrics: 'I am ' });
    expect(items[1]).toEqual({ type: 'softLineBreak' });
    expect(items[2]).toEqual({ type: 'chordLyricsPair', chords: '', lyrics: 'a barber' });
  });

  it('supports a soft line break directly following a chord', () => {
    const chords = 'D/A';
    const lyrics = '\xA0a barber';
    const items: (SerializedChordLyricsPair | SerializedSoftLineBreak)[] =
      breakChordLyricsPairOnSoftLineBreak(chords, lyrics);

    expect(items[0]).toEqual({ type: 'chordLyricsPair', chords: 'D/A', lyrics: '' });
    expect(items[1]).toEqual({ type: 'softLineBreak' });
    expect(items[2]).toEqual({ type: 'chordLyricsPair', chords: '', lyrics: 'a barber' });
  });

  it('supports a chord without lyrics', () => {
    const chords = 'D/A';
    const lyrics = '';
    const items: (SerializedChordLyricsPair | SerializedSoftLineBreak)[] =
      breakChordLyricsPairOnSoftLineBreak(chords, lyrics);

    expect(items[0]).toEqual({ type: 'chordLyricsPair', chords: 'D/A', lyrics: '' });
  });

  it('returns an empty array when there are no chords or lyrics', () => {
    const chords = '';
    const lyrics = '';
    const items: (SerializedChordLyricsPair | SerializedSoftLineBreak)[] =
      breakChordLyricsPairOnSoftLineBreak(chords, lyrics);

    expect(items).toEqual([]);
  });
});
