import { breakChordLyricsPairOnSoftLineBreak } from '../../../src/parser/chord_pro/helpers';
import { SerializedChordLyricsPair, SerializedSoftLineBreak } from '../../../src/serialized_types';

describe('breakChordLyricsPairOnSoftLineBreak', () => {
  it('supports breaking a pair\'s lyrics on a soft line break', () => {
    const chords = 'D/A';
    const lyrics = 'I am \xA0a barber';
    const items: Array<SerializedChordLyricsPair | SerializedSoftLineBreak> =
      breakChordLyricsPairOnSoftLineBreak(chords, lyrics);

    expect(items[0]).toEqual({ type: 'chordLyricsPair', chords: 'D/A', lyrics: 'I am ' });
    expect(items[1]).toEqual({ type: 'softLineBreak' });
    expect(items[2]).toEqual({ type: 'chordLyricsPair', chords: '', lyrics: 'a barber' });
  });

  it('supports a soft line break directly following a chord', () => {
    const chords = 'D/A';
    const lyrics = '\xA0a barber';
    const items: Array<SerializedChordLyricsPair | SerializedSoftLineBreak> =
      breakChordLyricsPairOnSoftLineBreak(chords, lyrics);

    expect(items[0]).toEqual({ type: 'chordLyricsPair', chords: 'D/A', lyrics: '' });
    expect(items[1]).toEqual({ type: 'softLineBreak' });
    expect(items[2]).toEqual({ type: 'chordLyricsPair', chords: '', lyrics: 'a barber' });
  });

  it('supports a chord without lyrics', () => {
    const chords = 'D/A';
    const lyrics = '';
    const items: Array<SerializedChordLyricsPair | SerializedSoftLineBreak> =
      breakChordLyricsPairOnSoftLineBreak(chords, lyrics);

    expect(items[0]).toEqual({ type: 'chordLyricsPair', chords: 'D/A', lyrics: '' });
  });

  it('returns an empty array when there are no chords or lyrics', () => {
    const chords = '';
    const lyrics = '';
    const items: Array<SerializedChordLyricsPair | SerializedSoftLineBreak> =
      breakChordLyricsPairOnSoftLineBreak(chords, lyrics);

    expect(items).toEqual([]);
  });
});
