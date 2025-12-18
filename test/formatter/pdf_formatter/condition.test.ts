import Condition from '../../../src/layout/engine/condition';
import { ConditionalRule } from '../../../src/formatter/configuration';

describe('Condition', () => {
  describe('#evaluate', () => {
    describe('and', () => {
      it('returns true when all conditions are true', () => {
        const metadata = {
          page: 5,
          composer: 'Bach',
        };

        const rule: ConditionalRule = {
          and: [
            { page: { equals: 5 } },
            { composer: { equals: 'Bach' } },
          ],
        };

        expect(new Condition(rule, metadata).evaluate()).toBe(true);
      });

      it('returns false when one condition is false', () => {
        const metadata = {
          page: 5,
          composer: 'Bach',
        };

        const rule: ConditionalRule = {
          and: [
            { page: { equals: 5 } },
            { composer: { equals: 'Beethoven' } },
          ],
        };

        expect(new Condition(rule, metadata).evaluate()).toBe(false);
      });
    });

    describe('or', () => {
      it('returns true when one condition is true', () => {
        const metadata = {
          page: 5,
          composer: 'Bach',
        };

        const rule: ConditionalRule = {
          or: [
            { page: { equals: 5 } },
            { composer: { equals: 'Beethoven' } },
          ],
        };

        expect(new Condition(rule, metadata).evaluate()).toBe(true);
      });

      it('returns false when all conditions are false', () => {
        const metadata = {
          page: 5,
          composer: 'Bach',
        };

        const rule: ConditionalRule = {
          or: [
            { page: { equals: 6 } },
            { composer: { equals: 'Beethoven' } },
          ],
        };

        expect(new Condition(rule, metadata).evaluate()).toBe(false);
      });
    });

    describe('all', () => {
      it('returns true when all values are present in the variable', () => {
        const metadata = {
          composer: ['Bach', 'Beethoven'],
        };

        const rule: ConditionalRule = {
          composer: { all: ['Bach', 'Beethoven'] },
        };

        expect(new Condition(rule, metadata).evaluate()).toBe(true);
      });

      it('returns true when the variable contains more values than the rule', () => {
        const metadata = {
          composer: ['Bach', 'Beethoven', 'Mozart'],
        };

        const rule: ConditionalRule = {
          composer: { all: ['Bach', 'Beethoven'] },
        };

        expect(new Condition(rule, metadata).evaluate()).toBe(true);
      });

      it('returns false when the variable contains not all values from the rule', () => {
        const metadata = {
          composer: ['Bach', 'Mozart'],
        };

        const rule: ConditionalRule = {
          composer: { all: ['Bach', 'Beethoven'] },
        };

        expect(new Condition(rule, metadata).evaluate()).toBe(false);
      });

      it('returns false when the variable contains none of the values from the rule', () => {
        const metadata = {
          composer: ['Mozart'],
        };

        const rule: ConditionalRule = {
          composer: { all: ['Bach', 'Beethoven'] },
        };

        expect(new Condition(rule, metadata).evaluate()).toBe(false);
      });
    });

    describe('contains', () => {
      it('returns true when the variable contains the rule', () => {
        const metadata = {
          composer: 'Johann Sebastian Bach',
        };

        const rule: ConditionalRule = {
          composer: { contains: 'Bach' },
        };

        expect(new Condition(rule, metadata).evaluate()).toBe(true);
      });

      it('returns true when the variable contains the rule with different casing', () => {
        const metadata = {
          composer: 'Johann Sebastian Bach',
        };

        const rule: ConditionalRule = {
          composer: { contains: 'bach' },
        };

        expect(new Condition(rule, metadata).evaluate()).toBe(true);
      });

      it('returns false when the variable does not contain the rule', () => {
        const metadata = {
          composer: 'Johann Sebastian Bach',
        };

        const rule: ConditionalRule = {
          composer: { contains: 'Beethoven' },
        };

        expect(new Condition(rule, metadata).evaluate()).toBe(false);
      });
    });

    describe('equals', () => {
      it('returns true when the variable is equal to the rule', () => {
        const metadata = {
          composer: 'Johann Sebastian Bach',
        };

        const rule: ConditionalRule = {
          composer: { equals: 'Johann Sebastian Bach' },
        };

        expect(new Condition(rule, metadata).evaluate()).toBe(true);
      });

      it('returns false when the variable is not equal to the rule', () => {
        const metadata = {
          composer: 'Johann Sebastian Bach',
        };

        const rule: ConditionalRule = {
          composer: { equals: 'Beethoven' },
        };

        expect(new Condition(rule, metadata).evaluate()).toBe(false);
      });

      it('returns false when the variable does not exist', () => {
        const metadata = {};

        const rule: ConditionalRule = {
          composer: { equals: 'Johann Sebastian Bach' },
        };

        expect(new Condition(rule, metadata).evaluate()).toBe(false);
      });
    });

    describe('exists', () => {
      it('returns true when the variable exists', () => {
        const metadata = {
          composer: 'Johann Sebastian Bach',
        };

        const rule: ConditionalRule = {
          composer: { exists: true },
        };

        expect(new Condition(rule, metadata).evaluate()).toBe(true);
      });

      it('returns false when the variable does not exist', () => {
        const metadata = {};

        const rule: ConditionalRule = {
          composer: { exists: true },
        };

        expect(new Condition(rule, metadata).evaluate()).toBe(false);
      });
    });

    describe('greaterThan', () => {
      it('returns true when the variable is greater than the rule', () => {
        const metadata = {
          page: 5,
        };

        const rule: ConditionalRule = {
          page: { greater_than: 4 },
        };

        expect(new Condition(rule, metadata).evaluate()).toBe(true);
      });

      it('returns false when the variable is equal to the rule', () => {
        const metadata = {
          page: 5,
        };

        const rule: ConditionalRule = {
          page: { greater_than: 5 },
        };

        expect(new Condition(rule, metadata).evaluate()).toBe(false);
      });

      it('returns false when the variable is less than the rule', () => {
        const metadata = {
          page: 5,
        };

        const rule: ConditionalRule = {
          page: { greater_than: 6 },
        };

        expect(new Condition(rule, metadata).evaluate()).toBe(false);
      });

      it('allows the number to be a string', () => {
        const metadata = {
          page: '5',
        };

        const rule: ConditionalRule = {
          page: { greater_than: 4 },
        };

        expect(new Condition(rule, metadata).evaluate()).toBe(true);
      });

      it('returns false when the variable cannot be converted to a number', () => {
        const metadata = {
          page: 'five',
        };

        const rule: ConditionalRule = {
          page: { greater_than: 4 },
        };

        expect(new Condition(rule, metadata).evaluate()).toBe(false);
      });

      it('returns false when the variable does not exist', () => {
        const metadata = {};

        const rule: ConditionalRule = {
          page: { greater_than: 4 },
        };

        expect(new Condition(rule, metadata).evaluate()).toBe(false);
      });
    });

    describe('greaterThanEqual', () => {
      it('returns true when the variable is greater than the rule', () => {
        const metadata = {
          page: 5,
        };

        const rule: ConditionalRule = {
          page: { greater_than_equal: 4 },
        };

        expect(new Condition(rule, metadata).evaluate()).toBe(true);
      });

      it('returns true when the variable is equal to the rule', () => {
        const metadata = {
          page: 5,
        };

        const rule: ConditionalRule = {
          page: { greater_than_equal: 5 },
        };

        expect(new Condition(rule, metadata).evaluate()).toBe(true);
      });

      it('returns false when the variable is less than the rule', () => {
        const metadata = {
          page: 5,
        };

        const rule: ConditionalRule = {
          page: { greater_than_equal: 6 },
        };

        expect(new Condition(rule, metadata).evaluate()).toBe(false);
      });

      it('allows the number to be a string', () => {
        const metadata = {
          page: '5',
        };

        const rule: ConditionalRule = {
          page: { greater_than_equal: 4 },
        };

        expect(new Condition(rule, metadata).evaluate()).toBe(true);
      });

      it('returns false when the variable cannot be converted to a number', () => {
        const metadata = {
          page: 'five',
        };

        const rule: ConditionalRule = {
          page: { greater_than_equal: 4 },
        };

        expect(new Condition(rule, metadata).evaluate()).toBe(false);
      });

      it('returns false when the variable does not exist', () => {
        const metadata = {};

        const rule: ConditionalRule = {
          page: { greater_than_equal: 4 },
        };

        expect(new Condition(rule, metadata).evaluate()).toBe(false);
      });
    });

    describe('in', () => {
      it('returns true when the variable is in the rule', () => {
        const metadata = {
          page: 5,
        };

        const rule: ConditionalRule = {
          page: { in: [4, 5, 6] },
        };

        expect(new Condition(rule, metadata).evaluate()).toBe(true);
      });

      it('returns false when the variable is not in the rule', () => {
        const metadata = {
          page: 5,
        };

        const rule: ConditionalRule = {
          page: { in: [4, 6] },
        };

        expect(new Condition(rule, metadata).evaluate()).toBe(false);
      });

      it('returns false when the variable does not exist', () => {
        const metadata = {};

        const rule: ConditionalRule = {
          page: { in: [4, 5, 6] },
        };

        expect(new Condition(rule, metadata).evaluate()).toBe(false);
      });
    });

    describe('lessThan', () => {
      it('returns true when the variable is less than the rule', () => {
        const metadata = {
          page: 5,
        };

        const rule: ConditionalRule = {
          page: { less_than: 6 },
        };

        expect(new Condition(rule, metadata).evaluate()).toBe(true);
      });

      it('returns false when the variable is equal to the rule', () => {
        const metadata = {
          page: 5,
        };

        const rule: ConditionalRule = {
          page: { less_than: 5 },
        };

        expect(new Condition(rule, metadata).evaluate()).toBe(false);
      });

      it('returns false when the variable is greater than the rule', () => {
        const metadata = {
          page: 5,
        };

        const rule: ConditionalRule = {
          page: { less_than: 4 },
        };

        expect(new Condition(rule, metadata).evaluate()).toBe(false);
      });

      it('allows the number to be a string', () => {
        const metadata = {
          page: '5',
        };

        const rule: ConditionalRule = {
          page: { less_than: 6 },
        };

        expect(new Condition(rule, metadata).evaluate()).toBe(true);
      });

      it('returns false when the variable cannot be converted to a number', () => {
        const metadata = {
          page: 'five',
        };

        const rule: ConditionalRule = {
          page: { less_than: 6 },
        };

        expect(new Condition(rule, metadata).evaluate()).toBe(false);
      });

      it('returns false when the variable does not exist', () => {
        const metadata = {};

        const rule: ConditionalRule = {
          page: { less_than: 6 },
        };

        expect(new Condition(rule, metadata).evaluate()).toBe(false);
      });
    });

    describe('lessThanEqual', () => {
      it('returns true when the variable is less than the rule', () => {
        const metadata = {
          page: 5,
        };

        const rule: ConditionalRule = {
          page: { less_than_equal: 6 },
        };

        expect(new Condition(rule, metadata).evaluate()).toBe(true);
      });

      it('returns true when the variable is equal to the rule', () => {
        const metadata = {
          page: 5,
        };

        const rule: ConditionalRule = {
          page: { less_than_equal: 5 },
        };

        expect(new Condition(rule, metadata).evaluate()).toBe(true);
      });

      it('returns false when the variable is greater than the rule', () => {
        const metadata = {
          page: 5,
        };

        const rule: ConditionalRule = {
          page: { less_than_equal: 4 },
        };

        expect(new Condition(rule, metadata).evaluate()).toBe(false);
      });

      it('allows the number to be a string', () => {
        const metadata = {
          page: '5',
        };

        const rule: ConditionalRule = {
          page: { less_than_equal: 6 },
        };

        expect(new Condition(rule, metadata).evaluate()).toBe(true);
      });

      it('returns false when the variable cannot be converted to a number', () => {
        const metadata = {
          page: 'five',
        };

        const rule: ConditionalRule = {
          page: { less_than_equal: 6 },
        };

        expect(new Condition(rule, metadata).evaluate()).toBe(false);
      });

      it('returns false when the variable does not exist', () => {
        const metadata = {};

        const rule: ConditionalRule = {
          page: { less_than_equal: 6 },
        };

        expect(new Condition(rule, metadata).evaluate()).toBe(false);
      });
    });

    describe('like', () => {
      it('returns true when the variable is like the rule', () => {
        const metadata = {
          composer: 'Johann Sebastian Bach',
        };

        const rule: ConditionalRule = {
          composer: { like: 'Bach' },
        };

        expect(new Condition(rule, metadata).evaluate()).toBe(true);
      });

      it('returns true when the variable is like the rule with different casing', () => {
        const metadata = {
          composer: 'Johann Sebastian Bach',
        };

        const rule: ConditionalRule = {
          composer: { like: 'bach' },
        };

        expect(new Condition(rule, metadata).evaluate()).toBe(true);
      });

      it('returns false when the variable is not like the rule', () => {
        const metadata = {
          composer: 'Johann Sebastian Bach',
        };

        const rule: ConditionalRule = {
          composer: { like: 'Beethoven' },
        };

        expect(new Condition(rule, metadata).evaluate()).toBe(false);
      });

      it('returns false when the variable does not exist', () => {
        const metadata = {};

        const rule: ConditionalRule = {
          composer: { like: 'Bach' },
        };

        expect(new Condition(rule, metadata).evaluate()).toBe(false);
      });
    });

    describe('notEquals', () => {
      it('returns true when the variable is not equal to the rule', () => {
        const metadata = {
          composer: 'Johann Sebastian Bach',
        };

        const rule: ConditionalRule = {
          composer: { not_equals: 'Beethoven' },
        };

        expect(new Condition(rule, metadata).evaluate()).toBe(true);
      });

      it('returns false when the variable is equal to the rule', () => {
        const metadata = {
          composer: 'Bach',
        };

        const rule: ConditionalRule = {
          composer: { not_equals: 'Bach' },
        };

        expect(new Condition(rule, metadata).evaluate()).toBe(false);
      });

      it('returns true when the variable does not exist', () => {
        const metadata = {};

        const rule: ConditionalRule = {
          composer: { not_equals: 'Bach' },
        };

        expect(new Condition(rule, metadata).evaluate()).toBe(true);
      });
    });

    describe('notIn', () => {
      it('returns true when the variable is not in the rule', () => {
        const metadata = {
          page: 5,
        };

        const rule: ConditionalRule = {
          page: { not_in: [4, 6] },
        };

        expect(new Condition(rule, metadata).evaluate()).toBe(true);
      });

      it('returns false when the variable is in the rule', () => {
        const metadata = {
          page: 5,
        };

        const rule: ConditionalRule = {
          page: { not_in: [4, 5, 6] },
        };

        expect(new Condition(rule, metadata).evaluate()).toBe(false);
      });

      it('returns true when the variable does not exist', () => {
        const metadata = {};

        const rule: ConditionalRule = {
          page: { not_in: [4, 5, 6] },
        };

        expect(new Condition(rule, metadata).evaluate()).toBe(true);
      });
    });

    describe('special rules for pages', () => {
      describe('first', () => {
        it('returns true when the page is the first page', () => {
          const metadata = {
            page: 1,
            pages: 5,
          };

          const rule: ConditionalRule = {
            page: { first: true },
          };

          expect(new Condition(rule, metadata).evaluate()).toBe(true);
        });

        it('returns false when the page is not the first page', () => {
          const metadata = {
            page: 2,
            pages: 5,
          };

          const rule: ConditionalRule = {
            page: { first: true },
          };

          expect(new Condition(rule, metadata).evaluate()).toBe(false);
        });
      });

      describe('last', () => {
        it('returns true when the page is the last page', () => {
          const metadata = {
            page: 5,
            pages: 5,
          };

          const rule: ConditionalRule = {
            page: { last: true },
          };

          expect(new Condition(rule, metadata).evaluate()).toBe(true);
        });

        it('returns false when the page is not the last page', () => {
          const metadata = {
            page: 4,
            pages: 5,
          };

          const rule: ConditionalRule = {
            page: { last: true },
          };

          expect(new Condition(rule, metadata).evaluate()).toBe(false);
        });
      });
    });
  });
});
