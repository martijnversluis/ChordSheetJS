import TagInterpreter from '../../src/chord_sheet/tag_interpreter';
import { AUTO, END_TAG, START_TAG } from '../../src/chord_sheet/tag';
import { ABC } from '../../src';

describe('TagInterpreter', () => {
  it('recognises start_of_part', () => {
    const [tagType, sectionType] = TagInterpreter.interpret('start_of_part', 'chorus');

    expect(tagType).toEqual(START_TAG);
    expect(sectionType).toEqual('chorus');
  });

  it('recognises end_of_part', () => {
    const [tagType, sectionType] = TagInterpreter.interpret('end_of_part', '');

    expect(tagType).toEqual(END_TAG);
    expect(sectionType).toEqual(AUTO);
  });

  it('recognises start_of_abc', () => {
    const [tagType, sectionType] = TagInterpreter.interpret('start_of_abc', '');

    expect(tagType).toEqual(START_TAG);
    expect(sectionType).toEqual('abc');
  });

  it('recognises end_of_abc', () => {
    const [tagType, sectionType] = TagInterpreter.interpret('end_of_abc', '');

    expect(tagType).toEqual(END_TAG);
    expect(sectionType).toEqual(ABC);
  });

  it('recognises start_of_bridge', () => {
    const [tagType, sectionType] = TagInterpreter.interpret('start_of_bridge', '');

    expect(tagType).toEqual(START_TAG);
    expect(sectionType).toEqual('bridge');
  });

  it('recognises end_of_bridge', () => {
    const [tagType, sectionType] = TagInterpreter.interpret('end_of_bridge', '');

    expect(tagType).toEqual(END_TAG);
    expect(sectionType).toEqual('bridge');
  });

  it('recognises start_of_chorus', () => {
    const [tagType, sectionType] = TagInterpreter.interpret('start_of_chorus', '');

    expect(tagType).toEqual(START_TAG);
    expect(sectionType).toEqual('chorus');
  });

  it('recognises end_of_chorus', () => {
    const [tagType, sectionType] = TagInterpreter.interpret('end_of_chorus', '');

    expect(tagType).toEqual(END_TAG);
    expect(sectionType).toEqual('chorus');
  });

  it('recognises start_of_grid', () => {
    const [tagType, sectionType] = TagInterpreter.interpret('start_of_grid', '');

    expect(tagType).toEqual(START_TAG);
    expect(sectionType).toEqual('grid');
  });

  it('recognises end_of_grid', () => {
    const [tagType, sectionType] = TagInterpreter.interpret('end_of_grid', '');

    expect(tagType).toEqual(END_TAG);
    expect(sectionType).toEqual('grid');
  });

  it('recognises start_of_ly', () => {
    const [tagType, sectionType] = TagInterpreter.interpret('start_of_ly', '');

    expect(tagType).toEqual(START_TAG);
    expect(sectionType).toEqual('ly');
  });

  it('recognises end_of_ly', () => {
    const [tagType, sectionType] = TagInterpreter.interpret('end_of_ly', '');

    expect(tagType).toEqual(END_TAG);
    expect(sectionType).toEqual('ly');
  });

  it('recognises start_of_tab', () => {
    const [tagType, sectionType] = TagInterpreter.interpret('start_of_tab', '');

    expect(tagType).toEqual(START_TAG);
    expect(sectionType).toEqual('tab');
  });

  it('recognises end_of_tab', () => {
    const [tagType, sectionType] = TagInterpreter.interpret('end_of_tab', '');

    expect(tagType).toEqual(END_TAG);
    expect(sectionType).toEqual('tab');
  });

  it('recognises start_of_verse', () => {
    const [tagType, sectionType] = TagInterpreter.interpret('start_of_verse', '');

    expect(tagType).toEqual(START_TAG);
    expect(sectionType).toEqual('verse');
  });

  it('recognises end_of_verse', () => {
    const [tagType, sectionType] = TagInterpreter.interpret('end_of_verse', '');

    expect(tagType).toEqual(END_TAG);
    expect(sectionType).toEqual('verse');
  });

  it('recognises start_of_x', () => {
    const [tagType, sectionType] = TagInterpreter.interpret('start_of_x', '');

    expect(tagType).toEqual(START_TAG);
    expect(sectionType).toEqual('x');
  });

  it('recognises end_of_x', () => {
    const [tagType, sectionType] = TagInterpreter.interpret('end_of_x', '');

    expect(tagType).toEqual(END_TAG);
    expect(sectionType).toEqual('x');
  });
});
