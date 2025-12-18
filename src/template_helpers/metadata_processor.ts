import { MetadataConfiguration } from '../formatter/configuration';
import { MetadataRule } from '../formatter/configuration/base_configuration';

class MetadataProcessor {
  metadata: Record<string, string | string[]>;

  config: MetadataConfiguration;

  processedKeys: Set<string>;

  result: [string, string | string[]][];

  constructor(
    metadata: Record<string, string | string[]>,
    config: MetadataConfiguration,
  ) {
    this.metadata = metadata;
    this.config = config;
    this.processedKeys = new Set<string>();
    this.result = [];
  }

  process(): [string, string | string[]][] {
    this.config.order.forEach((orderItem) => {
      if (typeof orderItem === 'string') {
        this.addItemByStringKey(orderItem);
      } else {
        this.addMatchingKeys(orderItem);
      }
    });

    return this.result;
  }

  private addMatchingKeys(orderItem: MetadataRule) {
    // Rule - find all matching keys
    const matchingKeys = this.findMatchingKeys(this.metadata, orderItem);
    const visibleKeys = matchingKeys.filter((key) => {
      if (orderItem.visible === false) return false;
      return !this.processedKeys.has(key);
    });

    // Sort the matching keys according to the rule
    const sortedKeys = this.sortKeys(visibleKeys, orderItem);

    // Add to result
    sortedKeys.forEach((key) => {
      this.result.push([key, this.metadata[key]]);
      this.processedKeys.add(key);
    });
  }

  private findMatchingKeys(
    metadata: Record<string, string | string[]>,
    rule: MetadataRule,
  ): string[] {
    const keys = Object.keys(metadata);

    if (typeof rule.match === 'string') {
      return keys.filter((key) => key === rule.match);
    }

    if (Array.isArray(rule.match)) {
      return keys.filter((key) => (rule.match as string[]).includes(key));
    }

    if (rule.match instanceof RegExp) {
      return keys.filter((key) => (rule.match as RegExp).test(key));
    }

    if (typeof rule.match === 'function') {
      return keys.filter((k) => (rule.match as (key: string) => boolean)(k));
    }

    return [];
  }

  private addItemByStringKey(orderItem: string) {
    // Simple string - look for exact match

    if (this.metadata[orderItem] !== undefined && !this.processedKeys.has(orderItem)) {
      this.result.push([orderItem, this.metadata[orderItem]]);
      this.processedKeys.add(orderItem);
    }
  }

  private sortKeys(keys: string[], rule: MetadataRule): string[] {
    switch (rule.sortMethod) {
      case 'alphabetical':
        return [...keys].sort();

      case 'custom':
        if (rule.customSort) {
          return [...keys].sort(rule.customSort);
        }
        return keys;

      case 'preserve':
      default:
        // If match is an array, preserve its order for matching keys
        if (Array.isArray(rule.match)) {
          const orderMap = new Map(rule.match.map((key, index) => [key, index]));
          return [...keys].sort((a, b) => {
            const aIndex = orderMap.get(a) ?? Infinity;
            const bIndex = orderMap.get(b) ?? Infinity;
            return aIndex - bIndex;
          });
        }
        return keys;
    }
  }
}

export default MetadataProcessor;
