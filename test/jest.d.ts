/* eslint-disable @typescript-eslint/no-unused-vars */
import { TernaryProperties } from '../src/chord_sheet/chord_pro/ternary';
import { ContentType } from '../src/serialized_types';
import StubbedPdfDoc, { RenderedItem, RenderedLine, RenderedText } from './formatter/stubbed_pdf_doc';

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeKey({ note, modifier, minor: boolean }): jest.CustomMatcherResult;

      toBeChordLyricsPair(chords: string, lyrics: string, annotation?: string): jest.CustomMatcherResult;

      toBeLiteral(string: string): jest.CustomMatcherResult;

      toBeSection(_type: ContentType, _contents: string): jest.CustomMatcherResult;

      toBeTernary(properties: TernaryProperties): jest.CustomMatcherResult;

      toBeComment(_contents: string): jest.CustomMatcherResult;

      toBeTag(_name: string, _value?: string): jest.CustomMatcherResult;

      toBeSoftLineBreak(): jest.CustomMatcherResult;

      toHaveLine(_x1: number, _y1: number, _x2: number, _y2: number): jest.CustomMatcherResult;

      toHaveRenderedItem(expected: Partial<RenderedItem>): jest.CustomMatcherResult;

      toHaveText(_text: string, _x: number, _y: number): jest.CustomMatcherResult;
    }
  }
}

export {};
