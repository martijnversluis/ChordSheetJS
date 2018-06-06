import { Assertion } from 'chai';

import ChordLyricsPair from '../src/chord_sheet/chord_lyrics_pair';
import Tag from '../src/chord_sheet/tag';

Assertion.addMethod('chordLyricsPair', function chordLyricsPair(chords, lyrics) {
  const obj = this._obj;

  new Assertion(this._obj).to.be.instanceof(ChordLyricsPair);

  this.assert(
    obj.chords === chords,
    'expected #{this} chords to be #{exp} but got #{act}',
    'expected #{this} chords not to be #{exp} but got #{act}',
    chords,
    obj.chords,
  );

  this.assert(
    obj.lyrics === lyrics,
    'expected #{this} lyrics to be #{exp} but got #{act}',
    'expected #{this} lyrics not to be #{exp} but got #{act}',
    lyrics,
    obj.lyrics,
  );
});

Assertion.addMethod('tag', function tag(name, value) {
  const obj = this._obj;

  new Assertion(this._obj).to.be.instanceof(Tag);

  this.assert(
    obj.name === name,
    'expected #{this} name to be #{exp} but got #{act}',
    'expected #{this} name not to be #{exp} but got #{act}',
    name,
    obj.name,
  );

  this.assert(
    obj.value === value,
    'expected #{this} value to be #{exp} but got #{act}',
    'expected #{this} value not to be #{exp} but got #{act}',
    value,
    obj.value,
  );
});

Assertion.addMethod('equalText', function equalText(otherText) {
  const actual = this._obj.replace(/>/g, '>\n');
  const expected = otherText.replace(/>/g, '>\n');

  new Assertion(actual).not.to.be.differentFrom(expected, { showSpace: true, context: 10 });
});
