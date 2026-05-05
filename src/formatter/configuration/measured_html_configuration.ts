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
      name: 'Arial', style: 'bold', size: 22, color: '#151515',
    },
    subtitle: {
      name: 'Arial', style: 'normal', size: 11, color: '#6f6f6f',
    },
    metadata: {
      name: 'Arial', style: 'normal', size: 10, color: '#8b8b8b',
    },
    text: {
      name: 'Arial', style: 'normal', size: 10, color: '#232323',
    },
    chord: {
      name: 'Arial', style: 'bold', size: 9, color: '#232323',
    },
    comment: {
      name: 'Arial', style: 'bold', size: 10, color: '#232323',
    },
    sectionLabel: {
      name: 'Arial', style: 'bold', size: 10, color: '#a1312d',
    },
    annotation: {
      name: 'Arial', style: 'normal', size: 10, color: '#232323',
    },
  },
  layout: {
    global: {
      margins: {
        top: 14,
        bottom: 12,
        left: 45,
        right: 45,
      },
    },
    header: {
      height: 72,
      content: [
        {
          type: 'text',
          template: '%{title}',
          style: {
            name: 'Arial', style: 'bold', size: 19, color: '#151515', weight: 700,
          },
          position: {
            x: 'left', y: 0, clip: true, ellipsis: true,
          },
          condition: {
            page: { first: true },
          },
        },
        {
          type: 'text',
          template: '%{artist}',
          style: {
            name: 'Arial', style: 'normal', size: 11, color: '#6f6f6f',
          },
          position: {
            x: 'left', y: 25, clip: true, ellipsis: true,
          },
          condition: {
            page: { first: true },
          },
        },
        {
          type: 'text',
          template: '%{tempo|%{} BPM}%{time| \u00b7 %{}}%{capo| \u00b7 Capo %{}}',
          style: {
            name: 'Arial', style: 'normal', size: 11, color: '#6f6f6f',
          },
          position: {
            x: 'left', y: 40, width: 240, clip: true, ellipsis: true,
          },
          condition: {
            page: { first: true },
          },
        },
        {
          type: 'line',
          style: { width: 1, color: '#d7d7d7' },
          position: {
            x: 0, y: 60, width: 'auto', height: 0,
          },
          condition: {
            page: { first: true },
          },
        },
        {
          type: 'text',
          template: '%{key}',
          cssClass: 'measured-html-key-badge',
          elementStyle: {
            width: '28px',
            height: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '999px',
            backgroundColor: '#a1312d',
            textAlign: 'center',
            boxSizing: 'border-box',
          },
          style: {
            name: 'Arial', style: 'bold', size: 12, color: '#ffffff', weight: 700,
          },
          position: {
            x: 'right',
            y: 12,
            width: 28,
            offsetX: -2,
          },
          condition: {
            and: [
              { page: { first: true } },
              { key: { exists: true } },
            ],
          },
        },
        {
          type: 'text',
          template: '%{title}',
          style: {
            name: 'Arial', style: 'bold', size: 12, color: '#151515', weight: 700,
          },
          position: {
            x: 'left', y: 0, clip: true, ellipsis: true,
          },
          condition: {
            page: { greater_than: 1 },
          },
        },
        {
          type: 'text',
          template: '%{page}/%{pages}',
          style: {
            name: 'Arial', style: 'normal', size: 10, color: '#9a9a9a',
          },
          position: { x: 'right', y: 4, offsetX: -38 },
          condition: {
            page: { greater_than: 1 },
          },
        },
        {
          type: 'text',
          template: '%{key}',
          cssClass: 'measured-html-key-badge',
          elementStyle: {
            width: '28px',
            height: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '999px',
            backgroundColor: '#a1312d',
            textAlign: 'center',
            boxSizing: 'border-box',
          },
          style: {
            name: 'Arial', style: 'bold', size: 12, color: '#ffffff', weight: 700,
          },
          position: {
            x: 'right',
            y: 2,
            width: 28,
            offsetX: -2,
          },
          condition: {
            and: [
              { page: { greater_than: 1 } },
              { key: { exists: true } },
            ],
          },
        },
        {
          type: 'line',
          style: { width: 1, color: '#d7d7d7' },
          position: {
            x: 0, y: 32, width: 'auto', height: 0,
          },
          condition: {
            page: { greater_than: 1 },
          },
        },
      ],
    },
    footer: {
      height: 0,
      content: [
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
          name: 'Arial', style: 'bold', size: 9, color: '#232323',
        },
        fingerings: {
          name: 'Arial', style: 'bold', size: 6, color: '#232323',
        },
        baseFret: {
          name: 'Arial', style: 'bold', size: 6, color: '#232323',
        },
      },
    },
  },
};
