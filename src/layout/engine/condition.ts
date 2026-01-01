import { ConditionRule, ConditionalRule, SingleCondition } from '../../formatter/configuration';

function isNumber(value: any): boolean {
  return !Number.isNaN(parseInt(value, 10));
}

function toNumber(value: any): number {
  return parseInt(value, 10);
}

class Condition {
  rule: ConditionalRule;

  metadata: Record<string, any>;

  constructor(rule: ConditionalRule, metadata: Record<string, any>) {
    this.rule = rule;
    this.metadata = metadata;
  }

  evaluate(): boolean {
    if ('and' in this.rule && Array.isArray(this.rule.and)) {
      return this.and(this.rule.and);
    }

    if ('or' in this.rule && Array.isArray(this.rule.or)) {
      return this.or(this.rule.or);
    }

    const [field, rule]: [string, SingleCondition] = Object.entries(this.rule)[0];

    if (!rule) {
      return false;
    }

    const value = this.metadata[field];

    return this.evaluateSingleCondition(value, field, rule);
  }

  private evaluateSingleCondition(value: any, field: string, rule: ConditionRule): boolean {
    const methodMapping: Record<string, (value: any, field: string, rule: ConditionRule) => boolean> = {
      'all': this.all,
      'contains': this.contains,
      'equals': this.equals,
      'exists': this.exists,
      'first': this.firstPage,
      'greater_than': this.greaterThan,
      'greater_than_equal': this.greaterThanEqual,
      'in': this.in,
      'last': this.lastPage,
      'less_than': this.lessThan,
      'less_than_equal': this.lessThanEqual,
      'like': this.like,
      'not_equals': this.notEquals,
      'not_in': this.notIn,
    };

    const ruleName = Object.keys(methodMapping).find((name) => name in rule);

    if (!ruleName) {
      return false;
    }

    const method = methodMapping[ruleName];
    return method.call(this, value, field, rule);
  }

  private all(value: any, _field: string, rule: ConditionRule): boolean {
    return Array.isArray(value) &&
      Array.isArray(rule.all) &&
      rule.all.every((item: any) => value.includes(item));
  }

  private and(rule: SingleCondition[]): boolean {
    return rule.every((subCondition: ConditionalRule) => new Condition(subCondition, this.metadata).evaluate());
  }

  private contains(value: any, _field: string, rule: ConditionRule): boolean {
    return typeof value === 'string' &&
      typeof rule.contains === 'string' &&
      value.toLowerCase().includes(rule.contains.toLowerCase());
  }

  private equals(value: any, _field: string, rule: ConditionRule): boolean {
    return value == rule.equals; // eslint-disable-line eqeqeq
  }

  private exists(value: any, _field: string, rule: ConditionRule): boolean {
    return !!rule.exists && value !== undefined;
  }

  private firstPage(_value: any, field: string, rule: ConditionRule): boolean {
    if (field !== 'page') {
      throw new Error('First page condition must be on the page field');
    }

    return !!rule.first && this.metadata.page === 1;
  }

  private greaterThan(value: any, _field: string, rule: ConditionRule): boolean {
    const greaterThan = rule.greater_than;

    if (!isNumber(value)) {
      return false;
    }

    return typeof greaterThan === 'number' && toNumber(value) > greaterThan;
  }

  private greaterThanEqual(value: any, _field: string, rule: ConditionRule): boolean {
    const greaterThanEqual = rule.greater_than_equal;

    if (!isNumber(value)) {
      return false;
    }

    return typeof greaterThanEqual === 'number' && toNumber(value) >= greaterThanEqual;
  }

  private in(value: any, _field: string, rule: ConditionRule): boolean {
    const inArray = rule.in;

    return Array.isArray(inArray) && inArray.includes(value);
  }

  private lastPage(_value: any, field: string, rule: ConditionRule): boolean {
    if (field !== 'page') {
      throw new Error('Last page condition must be on the page field');
    }

    return !!rule.last && this.metadata.page === this.metadata.pages;
  }

  private lessThan(value: any, _field: string, rule: ConditionRule): boolean {
    const lessThan = rule.less_than;

    if (!isNumber(value)) {
      return false;
    }

    return typeof lessThan === 'number' && toNumber(value) < lessThan;
  }

  private lessThanEqual(value: any, _field: string, rule: ConditionRule): boolean {
    const lessThanEqual = rule.less_than_equal;

    if (!isNumber(value)) {
      return false;
    }

    return typeof lessThanEqual === 'number' && toNumber(value) <= lessThanEqual;
  }

  private like(value: any, _field: string, rule: ConditionRule): boolean {
    const { like } = rule;

    return typeof value === 'string' &&
      typeof like === 'string' &&
      value.toLowerCase().includes(like.toLowerCase());
  }

  private notEquals(value: any, _field: string, rule: ConditionRule): boolean {
    return value != rule.not_equals; // eslint-disable-line eqeqeq
  }

  private notIn(value: any, _field: string, rule: ConditionRule): boolean {
    return Array.isArray(rule.not_in) && !rule.not_in.includes(value);
  }

  private or(rule: ConditionalRule[]) {
    return rule.some((subCondition: ConditionalRule) => new Condition(subCondition, this.metadata).evaluate());
  }
}

export default Condition;
