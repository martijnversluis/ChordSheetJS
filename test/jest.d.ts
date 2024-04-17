/* eslint-disable no-unused-vars, no-undef, @typescript-eslint/no-unused-vars */
import { TernaryProperties } from '../src/chord_sheet/chord_pro/ternary';
import { ContentType } from '../src/chord_sheet_serializer';

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeKey({ note, modifier, minor = false }): CustomMatcherResult;

      toBeChordLyricsPair(chords: string, lyrics: string, annotation?: string): CustomMatcherResult;

      toBeLiteral(string: string): CustomMatcherResult;

      toBeSection(_type: ContentType, _contents: string): CustomMatcherResult;

      toBeTernary(properties: TernaryProperties): CustomMatcherResult;

      toBeComment(_contents: string): CustomMatcherResult;

      toBeTag(_name: string, _value?: string): CustomMatcherResult;
    }
  }
}

export {};
