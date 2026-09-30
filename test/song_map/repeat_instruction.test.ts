import RepeatInstruction from '../../src/song_map/repeat_instruction';

describe('RepeatInstruction', () => {
  describe('.parse', () => {
    describe('finite repeat instructions', () => {
      const examples: [string, string, number][] = [
        ['2x', '2x', 2],
        ['x2', 'x2', 2],
        ['(2x)', '(2x)', 2],
        ['Chorus (3x)', '(3x)', 3],
        ['Repeat 2x', 'Repeat 2x', 2],
        ['Repeat 2 times', 'Repeat 2 times', 2],
        ['Chorus 4 times', '4 times', 4],
      ];

      examples.forEach(([text, instruction, count]) => {
        it(`recognizes ${text}`, () => {
          expect(RepeatInstruction.parse(text)).toEqual(
            expect.objectContaining({ text: instruction, count }),
          );
        });
      });
    });

    describe('invalid repeat values', () => {
      ['0x', '-1x', '1.5x', 'repeat until cue', 'Repeat ad lib'].forEach((text) => {
        it(`does not return a count for ${text}`, () => {
          expect(RepeatInstruction.parse(text)?.count).toBeNull();
        });
      });
    });

    describe('text without a repeat instruction', () => {
      ['Chorus', 'Verse 2', 'Capo 2', 'Repeat 2', 'Repeat 2 more bars', ''].forEach((text) => {
        it(`returns null for ${JSON.stringify(text)}`, () => {
          expect(RepeatInstruction.parse(text)).toBeNull();
        });
      });
    });
  });

  describe('.strip', () => {
    it('removes the instruction from the text', () => {
      expect(RepeatInstruction.strip('Chorus (2x)')).toEqual('Chorus');
    });

    it('leaves text without an instruction untouched', () => {
      expect(RepeatInstruction.strip('Verse 2')).toEqual('Verse 2');
    });
  });
});
