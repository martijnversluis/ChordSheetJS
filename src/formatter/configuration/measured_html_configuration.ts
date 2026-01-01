import {
  MeasurementBasedConfigurationProperties,
  MeasurementBasedFormatterConfiguration,
  MeasurementBasedLayoutConfig,
  SectionsConfig,
} from './measurement_based_configuration';

// MeasuredHtml layout configuration extends measurement-based layout
export interface MeasuredHtmlLayoutConfig extends MeasurementBasedLayoutConfig {
  // MeasuredHtml requires these fields that are optional in the base config
  header: MeasurementBasedLayoutConfig['header'];
  footer: MeasurementBasedLayoutConfig['footer'];
  sections: SectionsConfig;
}

// MeasuredHtml formatter configuration
export interface MeasuredHtmlFormatterConfiguration extends MeasurementBasedFormatterConfiguration {
  version: string;
  // Override layout with the MeasuredHtml layout config
  layout: MeasuredHtmlLayoutConfig;
  pageSize: {
    width: number;
    height: number;
  };
  cssClassPrefix?: string;
  additionalCss?: string;
  cssClasses?: {
    container?: string;
    page?: string;
    chord?: string;
    lyrics?: string;
    sectionLabel?: string;
    comment?: string;
    header?: string;
    footer?: string;
  };
}

// MeasuredHtml ConfigurationProperties type
export interface MeasuredHtmlConfigurationProperties extends MeasurementBasedConfigurationProperties {
  version?: string;
  layout?: Partial<MeasuredHtmlLayoutConfig>;
  pageSize?: {
    width?: number;
    height?: number;
  };
  cssClassPrefix?: string;
  additionalCss?: string;
  cssClasses?: Record<string, string>;
}

export const measuredHtmlSpecificDefaults: Partial<MeasuredHtmlFormatterConfiguration> = {
  // Font settings for various elements
  pageSize: {
    width: 0,
    height: 0,
  },
  fonts: {
    title: {
      name: 'NimbusSansL-Bol', style: 'bold', size: 24, color: 'black',
    },
    subtitle: {
      name: 'NimbusSansL-Reg', style: 'normal', size: 10, color: 100,
    },
    metadata: {
      name: 'NimbusSansL-Reg', style: 'normal', size: 10, color: 100,
    },
    text: {
      name: 'NimbusSansL-Reg', style: 'normal', size: 10, color: 'black',
    },
    chord: {
      name: 'NimbusSansL-Bol', style: 'bold', size: 9, color: 'black',
    },
    comment: {
      name: 'NimbusSansL-Bol', style: 'bold', size: 10, color: 'black',
    },
    sectionLabel: {
      name: 'NimbusSansL-Bol', style: 'bold', size: 10, color: 'black',
    },
    annotation: {
      name: 'NimbusSansL-Reg', style: 'normal', size: 10, color: 'black',
    },
  },
  layout: {
    global: {
      margins: {
        top: 35,
        bottom: 10,
        left: 45,
        right: 45,
      },
    },
    header: {
      height: 60,
      content: [
        {
          type: 'text',
          template: '%{title}',
          style: {
            name: 'NimbusSansL-Bol', style: 'bold', size: 24, color: 'black',
          },
          position: { x: 'left', y: 15 },
        },
        {
          type: 'text',
          template: 'Key of %{key} - BPM %{tempo} - Time %{time}',
          style: {
            name: 'NimbusSansL-Reg', style: 'normal', size: 12, color: 100,
          },
          position: { x: 'left', y: 28 },
        },
        {
          type: 'text',
          template: 'By %{artist} %{subtitle}',
          style: {
            name: 'NimbusSansL-Reg', style: 'normal', size: 10, color: 100,
          },
          position: { x: 'left', y: 38 },
        },
      ],
    },
    footer: {
      height: 30,
      content: [
        {
          type: 'text',
          value: '©2024 My Music Publishing',
          style: {
            name: 'NimbusSansL-Reg', style: 'normal', size: 10, color: 'black',
          },
          position: { x: 'left', y: 0 },
        },
      ],
    },
    sections: {
      global: {
        paragraphSpacing: 10,
        linePadding: 4,
        chordLyricSpacing: 2,
        chordSpacing: 2,
        columnWidth: 0,
        columnSpacing: 25,
        minColumnWidth: 0,
        maxColumnWidth: 0,
      },
      base: {
        display: {
          lyricsOnly: false,
          repeatedSections: 'full',
        },
      },
    },
    chordDiagrams: {
      enabled: true,
      renderingConfig: {
        titleY: 28,
        neckWidth: 120,
        neckHeight: 160,
        nutThickness: 10,
        fretThickness: 4,
        nutColor: 0,
        fretColor: '#929292',
        stringIndicatorSize: 14,
        fingerIndicatorSize: 16,
        stringColor: 0,
        fingerIndicatorOffset: 0,
        stringThickness: 3,
        fretLineThickness: 4,
        openStringIndicatorThickness: 2,
        unusedStringIndicatorThickness: 2,
        markerThickness: 2,
        barreThickness: 2,
        titleFontSize: 48,
        baseFretFontSize: 8,
        fingerNumberFontSize: 28,
        showFingerNumbers: true,
        diagramSpacing: 7,
      },
      fonts: {
        title: {
          name: 'NimbusSansL-Bol', style: 'bold', size: 9, color: 'black',
        },
        fingerings: {
          name: 'NimbusSansL-Bol', style: 'bold', size: 6, color: 'black',
        },
        baseFret: {
          name: 'NimbusSansL-Bol', style: 'bold', size: 6, color: 'black',
        },
      },
    },
  },
};
