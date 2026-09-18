import {
  FontConfigurations,
  defaultFontConfigurations,
  resolveFontConfiguration,
} from '../../../src/formatter/configuration';

import { mergeConfigs } from '../../../src/utilities';

function configuredFonts(overrides: Record<string, any>): FontConfigurations {
  return mergeConfigs(defaultFontConfigurations, overrides);
}

describe('resolveFontConfiguration', () => {
  it('resolves token fonts from the final configured chord font', () => {
    const fonts = configuredFonts({
      chord: {
        name: 'Custom', size: 16, weight: 900, color: 'red',
      },
    });

    expect(resolveFontConfiguration(fonts, 'rhythmSymbol')).toMatchObject({
      name: 'Custom', size: 16, weight: 500, color: 'red',
    });
    expect(resolveFontConfiguration(fonts, 'barline')).toMatchObject({
      name: 'Custom', size: 16, weight: 900, color: 'red',
    });
    expect(resolveFontConfiguration(fonts, 'instruction')).toMatchObject({
      name: 'Custom', size: 16, weight: 900, color: 'red',
    });
  });

  it('merges explicit token overrides on top of the inherited font', () => {
    const fonts = configuredFonts({ instruction: { style: 'italic', weight: 600 } });

    expect(resolveFontConfiguration(fonts, 'instruction')).toMatchObject({
      name: 'Helvetica', size: 13, style: 'italic', weight: 600,
    });
  });

  it('applies default inheritance to a directly supplied partial token font', () => {
    const fonts = {
      ...defaultFontConfigurations,
      instruction: { weight: 600 },
    } as FontConfigurations;

    expect(resolveFontConfiguration(fonts, 'instruction')).toMatchObject({
      name: 'Helvetica', size: 13, style: 'bold', weight: 600,
    });
  });

  it('does not mutate inherited font configurations', () => {
    const fonts = configuredFonts({ chord: { weight: 800 } });

    resolveFontConfiguration(fonts, 'rhythmSymbol');

    expect(fonts.chord.weight).toBe(800);
    expect(fonts.chord.inherit).toBeUndefined();
  });

  it('rejects circular inheritance', () => {
    const fonts = configuredFonts({
      rhythmSymbol: { inherit: 'barline' },
      barline: { inherit: 'rhythmSymbol' },
    });

    expect(() => resolveFontConfiguration(fonts, 'rhythmSymbol'))
      .toThrow('Circular font inheritance: rhythmSymbol -> barline -> rhythmSymbol');
  });

  it('rejects missing inherited font sections', () => {
    const fonts = configuredFonts({ instruction: { inherit: 'barline' } });
    delete fonts.barline;

    expect(() => resolveFontConfiguration(fonts, 'instruction'))
      .toThrow('Missing font configuration: barline');
  });
});
