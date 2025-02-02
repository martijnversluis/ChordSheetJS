import {
  AUTO,
  CHORUS,
  END_OF_ABC,
  END_OF_BRIDGE,
  END_OF_CHORUS,
  END_OF_GRID,
  END_OF_LY,
  END_OF_PART,
  END_OF_TAB,
  END_OF_VERSE,
  END_TAG,
  START_OF_ABC,
  START_OF_BRIDGE,
  START_OF_CHORUS,
  START_OF_GRID,
  START_OF_LY,
  START_OF_PART,
  START_OF_TAB,
  START_OF_VERSE,
  START_TAG,
} from './tag';

import {
  ABC, BRIDGE, GRID, LILYPOND, TAB, VERSE,
} from '../constants';

const START_TAG_TO_SECTION_TYPE = {
  [START_OF_ABC]: ABC,
  [START_OF_BRIDGE]: BRIDGE,
  [START_OF_CHORUS]: CHORUS,
  [START_OF_GRID]: GRID,
  [START_OF_LY]: LILYPOND,
  [START_OF_TAB]: TAB,
  [START_OF_VERSE]: VERSE,
};

const END_TAG_TO_SECTION_TYPE = {
  [END_OF_ABC]: ABC,
  [END_OF_BRIDGE]: BRIDGE,
  [END_OF_CHORUS]: CHORUS,
  [END_OF_GRID]: GRID,
  [END_OF_LY]: LILYPOND,
  [END_OF_TAB]: TAB,
  [END_OF_VERSE]: VERSE,
};

const SECTION_START_REGEX = /^start_of_(.+)$/;
const SECTION_END_REGEX = /^end_of_(.+)$/;

class TagInterpreter {
  tagName: string;

  tagValue: string;

  static interpret(tagName: string, tagValue: string) {
    return new this(tagName, tagValue).interpret();
  }

  constructor(tagName: string, tagValue: string) {
    this.tagName = tagName;
    this.tagValue = tagValue;
  }

  interpret(): [string | null, string | null] {
    return this.startOfPart() ||
      this.endOfPart() ||
      this.sectionStart() ||
      this.sectionEnd() ||
      this.startOfSection() ||
      this.endOfSection() ||
      [null, null];
  }

  startOfPart(): [string, string] | null {
    if (this.tagName === START_OF_PART && this.tagValue) {
      return [START_TAG, this.tagValue.split(' ')[0].toLowerCase()];
    }

    return null;
  }

  endOfPart(): [string, string] | null {
    if (this.tagName === END_OF_PART) {
      return [END_TAG, AUTO];
    }

    return null;
  }

  sectionStart(): [string, string] | null {
    if (this.tagName in START_TAG_TO_SECTION_TYPE) {
      return [START_TAG, START_TAG_TO_SECTION_TYPE[this.tagName]];
    }

    return null;
  }

  sectionEnd(): [string, string] | null {
    if (this.tagName in END_TAG_TO_SECTION_TYPE) {
      return [END_TAG, END_TAG_TO_SECTION_TYPE[this.tagName]];
    }

    return null;
  }

  startOfSection(): [string, string] | null {
    const parseStartResult = SECTION_START_REGEX.exec(this.tagName);

    if (parseStartResult) {
      return [START_TAG, parseStartResult[1]];
    }

    return null;
  }

  endOfSection(): [string, string] | null {
    const parseEndResult = SECTION_END_REGEX.exec(this.tagName);

    if (parseEndResult) {
      return [END_TAG, parseEndResult[1]];
    }

    return null;
  }
}

export default TagInterpreter;
