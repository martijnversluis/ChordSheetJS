/* eslint-disable @typescript-eslint/no-unused-vars */
import { TernaryProperties } from '../src/chord_sheet/chord_pro/ternary';
import { ContentType } from '../src/serialized_types';

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeKey({ note, modifier, minor: boolean }): jest.CustomMatcherResult;

      toBeChordLyricsPair(chords: string, lyrics: string, annotation?: string): jest.CustomMatcherResult;

      toBeLiteral(string: string): jest.CustomMatcherResult;

      toBeSection(_type: ContentType, _contents: string): jest.CustomMatcherResult;

      toBeTernary(properties: TernaryProperties): jest.CustomMatcherResult;

      toBeComment(_contents: string): jest.CustomMatcherResult;

      toBeTag(_name: string, _value?: string, _selector?: string): jest.CustomMatcherResult;

      toBeSoftLineBreak(): jest.CustomMatcherResult;
    }
  }
}

export {};
