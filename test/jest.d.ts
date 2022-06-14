/* eslint-disable no-unused-vars, no-undef */
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

      toBeTernary(
        {
          variable = null,
          valueTest = null,
          trueExpression = null,
          falseExpression = null,
        }
      ): CustomMatcherResult;

      toBeComment(_contents: string): CustomMatcherResult;

      toBeTag(_name: string, _value?: string): CustomMatcherResult;
    }
  }
}

export {};
