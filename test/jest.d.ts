/* eslint-disable no-unused-vars, no-undef, @typescript-eslint/no-unused-vars */
import { TernaryProperties } from '../src/chord_sheet/chord_pro/ternary';

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeChord(
        {
          base,
          modifier,
          suffix,
          bassBase,
          bassModifier,
        }
        ): CustomMatcherResult;

      toBeNote({ note, type, minor }): CustomMatcherResult;

      toBeKey({ note, modifier, minor = false }): CustomMatcherResult;

      toBeChordLyricsPair(chords: string, lyrics: string): CustomMatcherResult;

      toBeLiteral(contents: string): CustomMatcherResult;

      toBeTernary(properties: TernaryProperties): CustomMatcherResult;

      toBeComment(_contents: string): CustomMatcherResult;

      toBeTag(_name: string, _value?: string): CustomMatcherResult;
    }
  }
}

export {};
