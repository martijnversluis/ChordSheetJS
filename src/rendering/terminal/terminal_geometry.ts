import type { TerminalFormatterConfiguration } from '../../formatter/configuration/terminal_configuration';
import type { TerminalGeometry } from './types';

function cell(value: number, minimum = 0): void {
  if (!Number.isInteger(value) || value < minimum) throw new Error('Terminal geometry requires finite integer cells');
}

function validate(config: TerminalFormatterConfiguration): void {
  const { global: columns } = config.layout.sections;
  cell(config.width, 1);
  [config.height, columns.columnCount, columns.minColumnWidth, columns.maxColumnWidth]
    .forEach((value) => { if (value !== undefined) cell(value, 1); });
  [columns.chordSpacing, columns.chordLyricSpacing, columns.linePadding, columns.paragraphSpacing,
    columns.columnSpacing, config.layout.global.pageSpacing, ...Object.values(config.layout.global.margins),
    config.layout.header?.height ?? 0, config.layout.footer?.height ?? 0].forEach((value) => cell(value));
  if (columns.minColumnWidth !== undefined && columns.maxColumnWidth !== undefined &&
      columns.minColumnWidth > columns.maxColumnWidth) {
    throw new Error('Minimum terminal column width exceeds maximum column width');
  }
  if (config.layout.footer && config.height === undefined) throw new Error('Footer requires finite height');
}

function resolveCount(config: TerminalFormatterConfiguration, width: number): number {
  const { minColumnWidth: min, maxColumnWidth: max, columnSpacing: spacing } = config.layout.sections.global;
  const feasible = (count: number) => {
    const size = Math.floor((width - (count - 1) * spacing) / count);
    return size >= (min ?? 1) && size <= (max ?? Infinity);
  };
  if (config.layout.sections.global.columnCount !== undefined) {
    if (!feasible(config.layout.sections.global.columnCount)) {
      throw new Error('Explicit column count violates column width bounds');
    }
    return config.layout.sections.global.columnCount;
  }
  if (min === undefined && max === undefined) return 1;

  // A maximum determines how many columns are needed; choose the smallest such
  // count so every column remains as wide as possible. A minimum caps how many
  // columns fit. If those constraints cross, retain fewer readable columns and
  // let them exceed the preferred maximum rather than creating undersized text.
  const neededForMaximum =
    max === undefined ? 1 : Math.max(1, Math.ceil((width + spacing) / (max + spacing)));
  if (min === undefined) return neededForMaximum;
  const fittingMinimum = Math.max(1, Math.floor((width + spacing) / (min + spacing)));
  if (max === undefined) return fittingMinimum;
  return Math.min(neededForMaximum, fittingMinimum);
}

export function terminalGeometry(config: TerminalFormatterConfiguration): TerminalGeometry {
  validate(config);
  const contentWidth = config.width - config.layout.global.margins.left - config.layout.global.margins.right;
  const contentY = config.layout.global.margins.top + (config.layout.header?.height ?? 0);
  const contentHeight =
    config.height === undefined ?
      null :
      config.height - contentY - config.layout.global.margins.bottom - (config.layout.footer?.height ?? 0);
  if (contentWidth < 1 || (contentHeight !== null && contentHeight < 1)) {
    throw new Error('Empty terminal content bounds');
  }
  const columnCount = resolveCount(config, contentWidth);
  if (columnCount > 1 && config.height === undefined) throw new Error('Multiple columns require finite height');
  return {
    columnCount,
    columnSpacing: config.layout.sections.global.columnSpacing,
    columnWidth: Math.floor(
      (contentWidth - (columnCount - 1) * config.layout.sections.global.columnSpacing) / columnCount,
    ),
    contentX: config.layout.global.margins.left,
    contentY,
    contentWidth,
    contentHeight,
  };
}
