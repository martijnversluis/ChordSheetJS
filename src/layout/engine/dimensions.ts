import { ColumnConfig, Margins, MeasurementBasedLayoutConfig } from '../../formatter/configuration';

class Dimensions {
  pageWidth: number;

  pageHeight: number;

  layoutConfig: MeasurementBasedLayoutConfig;

  columns: ColumnConfig;

  constructor(
    pageWidth: number,
    pageHeight: number,
    layoutConfig: MeasurementBasedLayoutConfig,
    columns: ColumnConfig,
  ) {
    this.pageWidth = pageWidth;
    this.pageHeight = pageHeight;
    this.layoutConfig = layoutConfig;
    this.columns = columns;
  }

  get margins(): Margins {
    return this.layoutConfig.global.margins;
  }

  get minX() {
    return this.margins.left;
  }

  get maxX() {
    return this.pageWidth - this.margins.right;
  }

  get minY() {
    return this.margins.top + this.layoutConfig.header.height;
  }

  get maxY() {
    return this.pageHeight - this.margins.bottom;
  }

  /**
   * Calculates the optimal number of columns based on available width and column constraints
   */
  calculateOptimalColumnCount(
    availableWidth: number,
    columnSpacing: number,
    minColumnWidth?: number,
    maxColumnWidth?: number,
  ): number {
    // If no constraints are provided, default to single column
    if (!minColumnWidth && !maxColumnWidth) {
      return 1;
    }

    // If only maxColumnWidth is provided, fit as many columns as possible
    if (maxColumnWidth && !minColumnWidth) {
      return this.fitMaxColumns(availableWidth, columnSpacing, maxColumnWidth);
    }

    // If only minColumnWidth is provided, fit as many columns as possible
    // while ensuring each column meets the minimum width requirement
    if (minColumnWidth && !maxColumnWidth) {
      return this.fitMaxColumnsWithMinWidth(availableWidth, columnSpacing, minColumnWidth);
    }

    // Both constraints provided - find the optimal column count
    if (minColumnWidth && maxColumnWidth) {
      return this.findMaxColumnsWithinBounds(availableWidth, columnSpacing, minColumnWidth, maxColumnWidth);
    }

    return 1;
  }

  private findMaxColumnsWithinBounds(
    availableWidth: number,
    columnSpacing: number,
    minColumnWidth: number,
    maxColumnWidth: number,
  ) {
    // Start with the minimum number of columns that respect minColumnWidth
    const maxPossibleColumns = Math.floor(
      (availableWidth + columnSpacing) / (minColumnWidth + columnSpacing),
    );

    // Test each possible column count to find the best fit
    for (let columnCount = 1; columnCount <= maxPossibleColumns; columnCount += 1) {
      const result = this.evaluateColumnCount(
        columnCount,
        availableWidth,
        columnSpacing,
        minColumnWidth,
        maxColumnWidth,
      );
      if (result !== null) return result;
    }

    return Math.max(1, maxPossibleColumns);
  }

  private evaluateColumnCount(
    columnCount: number,
    availableWidth: number,
    columnSpacing: number,
    minColumnWidth: number,
    maxColumnWidth: number,
  ): number | null {
    const totalSpacing = (columnCount - 1) * columnSpacing;
    const columnWidth = (availableWidth - totalSpacing) / columnCount;

    // If column width is below minimum, this and higher counts are too narrow
    if (columnWidth < minColumnWidth) {
      return Math.max(1, columnCount - 1);
    }

    // If this column width fits within our constraints, check if we should stop here
    if (columnWidth >= minColumnWidth && columnWidth <= maxColumnWidth) {
      const nextColumnCount = columnCount + 1;
      const nextTotalSpacing = (nextColumnCount - 1) * columnSpacing;
      const nextColumnWidth = (availableWidth - nextTotalSpacing) / nextColumnCount;

      // If the next column count would be too narrow, use current count
      if (nextColumnWidth < minColumnWidth) return columnCount;
    }

    return null;
  }

  private fitMaxColumnsWithMinWidth(availableWidth: number, columnSpacing: number, minColumnWidth: number) {
    // For n columns, we need: n * minColumnWidth + (n-1) * columnSpacing <= availableWidth
    // Solving for n: n <= (availableWidth + columnSpacing) / (minColumnWidth + columnSpacing)
    const maxColumns = Math.floor((availableWidth + columnSpacing) / (minColumnWidth + columnSpacing));

    // Verify the calculation by checking if the columns actually fit
    const actualColumns = Math.max(1, maxColumns);
    const totalSpacingNeeded = (actualColumns - 1) * columnSpacing;
    const totalWidthNeeded = actualColumns * minColumnWidth + totalSpacingNeeded;

    // If our calculation is correct, this should always be true, but let's be safe
    if (totalWidthNeeded <= availableWidth) {
      return actualColumns;
    }

    // Fallback: try one less column
    return Math.max(1, actualColumns - 1);
  }

  private fitMaxColumns(availableWidth: number, columnSpacing: number, maxColumnWidth: number) {
    return Math.max(
      1,
      Math.floor((availableWidth + columnSpacing) / (maxColumnWidth + columnSpacing)),
    );
  }

  /**
   * Calculates the effective column spacing, adjusting it when columns would exceed maxColumnWidth
   * Note: Single columns are not constrained by maxColumnWidth and use full available width
   * When only minColumnWidth is specified, columns expand to fill available space equally
   */
  calculateEffectiveColumnSpacing(
    columnCount: number,
    availableWidth: number,
    baseColumnSpacing: number,
    maxColumnWidth?: number,
    minColumnWidth?: number,
  ): number {
    // Single columns or only minColumnWidth specified: use base spacing
    if (columnCount <= 1 || (minColumnWidth && !maxColumnWidth)) {
      return baseColumnSpacing;
    }

    // When maxColumnWidth is specified, adjust spacing if columns would be too wide
    if (maxColumnWidth) {
      return this.calculateAdjustedSpacing(
        columnCount,
        availableWidth,
        baseColumnSpacing,
        maxColumnWidth,
      );
    }

    return baseColumnSpacing;
  }

  private calculateAdjustedSpacing(
    columnCount: number,
    availableWidth: number,
    baseColumnSpacing: number,
    maxColumnWidth: number,
  ): number {
    const baseTotalSpacing = (columnCount - 1) * baseColumnSpacing;
    const baseColumnWidth = (availableWidth - baseTotalSpacing) / columnCount;

    // If columns would be larger than maxColumnWidth, add the difference to spacing
    if (baseColumnWidth > maxColumnWidth) {
      const excessWidth = baseColumnWidth - maxColumnWidth;
      const totalExcessWidth = excessWidth * columnCount;
      const additionalSpacingPerGap = totalExcessWidth / (columnCount - 1);
      return baseColumnSpacing + additionalSpacingPerGap;
    }

    return baseColumnSpacing;
  }

  get effectiveColumnCount(): number {
    const {
      columnCount,
      columnSpacing,
      minColumnWidth,
      maxColumnWidth,
    } = this.columns;

    // Calculate available space for columns
    const { left, right } = this.margins;
    const availableSpace = this.pageWidth - left - right;

    // If min/max constraints are provided, always calculate optimal column count
    // This ensures we maximize columns when only minColumnWidth is specified
    if (minColumnWidth || maxColumnWidth) {
      return this.calculateOptimalColumnCount(
        availableSpace,
        columnSpacing,
        minColumnWidth,
        maxColumnWidth,
      );
    }

    // If columnCount is explicitly set and no constraints, use it directly
    if (columnCount) {
      return columnCount;
    }

    // Fallback to configured column count
    return columnCount || 1;
  }

  get effectiveColumnSpacing(): number {
    const effectiveCount = this.effectiveColumnCount;
    const { left, right } = this.margins;
    const availableSpace = this.pageWidth - left - right;
    const baseSpacing = this.columns.columnSpacing;
    const { maxColumnWidth, minColumnWidth } = this.columns;

    return this.calculateEffectiveColumnSpacing(
      effectiveCount,
      availableSpace,
      baseSpacing,
      maxColumnWidth,
      minColumnWidth,
    );
  }

  get availableSpace(): number {
    const { left, right } = this.margins;
    return this.pageWidth - left - right;
  }

  get columnWidth(): number {
    const effectiveCount = this.effectiveColumnCount;
    const spacing = this.effectiveColumnSpacing;

    const totalColumnSpacing = (effectiveCount - 1) * spacing;
    const columnWidth = (this.availableSpace - totalColumnSpacing) / effectiveCount;

    const { maxColumnWidth, minColumnWidth } = this.columns;

    // Single columns should use the full available width
    if (effectiveCount === 1) {
      return columnWidth;
    }

    // When only minColumnWidth is specified, columns expand to fill space equally
    if (minColumnWidth && !maxColumnWidth) {
      return columnWidth; // Let columns expand beyond minColumnWidth to fill space
    }

    // When maxColumnWidth is specified, enforce the constraint for multiple columns
    if (maxColumnWidth && columnWidth > maxColumnWidth && effectiveCount > 1) {
      return maxColumnWidth;
    }

    return columnWidth;
  }
}

export default Dimensions;
