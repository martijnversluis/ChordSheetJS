import Formatter from './formatter';
import Song from '../chord_sheet/song';

import type { LayoutConfig } from '../layout/engine/types';
import type {
  TerminalConfigurationInput,
  TerminalFormatterConfiguration,
} from './configuration/terminal_configuration';
import type { TerminalDocument, TerminalGeometry } from '../rendering/terminal/types';

import { LayoutEngine } from '../layout/engine/layout_engine';
import { TerminalDocumentBuilder } from '../rendering/terminal/terminal_document';
import { TerminalMeasurer } from '../layout/measurement/terminal_measurer';
import { TerminalPolicy } from '../rendering/terminal/terminal_policy';
import { clonePositionedSong } from '../layout/engine/positioned_source';
import { getDefaultConfig } from './configuration/default_config_manager';
import { terminalGeometry } from '../rendering/terminal/terminal_geometry';

import { normalizeTerminalConfiguration } from './configuration/normalize_terminal_configuration';

const font = {
  size: 1,
  lineHeight: 1,
  name: 'monospace',
  style: 'normal',
  color: '#ffffff',
};

/** Experimental cell formatter. Finite pages opt into the engine's positioned layout policy. */
export default class TerminalFormatter extends Formatter<TerminalFormatterConfiguration> {
  constructor(configuration: TerminalConfigurationInput = {}) {
    super(normalizeTerminalConfiguration(configuration));
  }

  configure(configuration: TerminalConfigurationInput): this {
    return super.configure(normalizeTerminalConfiguration(configuration));
  }

  protected getDefaultConfiguration(): TerminalFormatterConfiguration {
    return getDefaultConfig<TerminalFormatterConfiguration>('terminal');
  }

  format(song: Song, overrides?: TerminalConfigurationInput): TerminalDocument {
    if (overrides) return new TerminalFormatter(this.configuration).configure(overrides).format(song);
    const geometry = terminalGeometry(this.configuration);
    const measurer = new TerminalMeasurer(this.configuration.cellWidth);
    const prepared = this.prepareSong(clonePositionedSong(song));
    const policy = new TerminalPolicy(this.configuration);
    const engine = new LayoutEngine(prepared, measurer, this.layoutConfiguration(geometry));
    const plan = engine.computePositionedLayout(
      {
        ...geometry,
        left: geometry.contentX,
        top: geometry.contentY,
        bodyHeight: geometry.contentHeight ?? undefined,
        paragraphSpacing: this.configuration.layout.sections.global.paragraphSpacing,
      },
      (paragraph, occurrence) => policy.prepare(paragraph, occurrence),
    );
    const builder = new TerminalDocumentBuilder(this.configuration, geometry, measurer);
    return builder.build(plan, prepared, policy.diagnostics);
  }

  private layoutConfiguration(geometry: TerminalGeometry): LayoutConfig {
    const { configuration: config } = this;
    return {
      width: geometry.columnWidth,
      columnWidth: geometry.columnWidth,
      fonts: {
        chord: font, lyrics: font, comment: font, sectionLabel: font,
      },
      chordSpacing: config.layout.sections.global.chordSpacing,
      chordLyricSpacing: config.layout.sections.global.chordLyricSpacing,
      linePadding: config.layout.sections.global.linePadding,
      minY: geometry.contentY,
      columnBottomY: Infinity,
      columnSpacing: geometry.columnSpacing,
      paragraphSpacing: config.layout.sections.global.paragraphSpacing,
      displayLyricsOnly: config.layout.sections.base.display.lyricsOnly,
      normalizeChords: config.normalizeChords,
      normalizeChordSuffix: config.normalizeChordSuffix,
      useUnicodeModifiers: config.useUnicodeModifiers,
      decapo: config.decapo,
      expandChorusDirective: config.expandChorusDirective,
      renderKey: config.key,
    };
  }
}
