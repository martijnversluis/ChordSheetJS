import {
  ConditionalRule,
  LayoutItem,
  MeasurementBasedLayoutConfig,
  SingleCondition,
} from '../../formatter/configuration';

function conditionUsesTotalPages(condition: ConditionalRule | undefined): boolean {
  if (!condition) {
    return false;
  }

  if ('and' in condition && Array.isArray(condition.and)) {
    return condition.and.some((subCondition) => conditionUsesTotalPages(subCondition));
  }

  if ('or' in condition && Array.isArray(condition.or)) {
    return condition.or.some((subCondition) => conditionUsesTotalPages(subCondition));
  }

  return Object.entries(condition as SingleCondition).some(([field, rule]) => (
    field === 'pages' || (field === 'page' && Boolean(rule?.last))
  ));
}

function sectionNeedsTotalPageAwareAutoHeight(section: LayoutItem | undefined): boolean {
  if (!section || section.height !== 'auto') {
    return false;
  }

  return section.content.some((item) => conditionUsesTotalPages(item.condition));
}

export function layoutNeedsTotalPageAwareAutoHeight(layout: MeasurementBasedLayoutConfig): boolean {
  return sectionNeedsTotalPageAwareAutoHeight(layout.header) ||
    sectionNeedsTotalPageAwareAutoHeight(layout.footer);
}
