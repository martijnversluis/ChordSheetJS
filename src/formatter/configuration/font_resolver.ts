import {
  FontConfiguration,
  FontConfigurations,
  FontSection,
  defaultFontConfigurations,
} from './measurement_based_configuration';

const REQUIRED_PROPERTIES: (keyof FontConfiguration)[] = ['name', 'style', 'size', 'color'];
const TOKEN_FONT_SECTIONS = new Set<FontSection>(['rhythmSymbol', 'barline', 'instruction', 'noChord']);

function rootTokenDefault(section: FontSection, chain: FontSection[]) {
  return chain.length === 0 && TOKEN_FONT_SECTIONS.has(section) ? defaultFontConfigurations[section] : undefined;
}

function validateResolvedFont(section: FontSection, font: FontConfiguration): void {
  const missing = REQUIRED_PROPERTIES.filter((property) => font[property] === undefined);
  if (missing.length > 0) {
    throw new Error(`Incomplete font configuration for ${section}: missing ${missing.join(', ')}`);
  }
}

function resolveFont(
  fonts: FontConfigurations,
  section: FontSection,
  chain: FontSection[],
): FontConfiguration {
  if (chain.includes(section)) {
    throw new Error(`Circular font inheritance: ${[...chain, section].join(' -> ')}`);
  }

  const defaultFont = rootTokenDefault(section, chain);
  const configuredFont = fonts[section] && defaultFont ?
    { ...defaultFont, ...fonts[section] } :
    fonts[section] || defaultFont;
  if (!configuredFont) throw new Error(`Missing font configuration: ${section}`);

  const inherited = configuredFont.inherit ?
    resolveFont(fonts, configuredFont.inherit, [...chain, section]) :
    {};
  const resolved = { ...inherited, ...configuredFont } as FontConfiguration;

  delete resolved.inherit;
  validateResolvedFont(section, resolved);
  return resolved;
}

export function resolveFontConfiguration(
  fonts: FontConfigurations,
  section: FontSection,
): FontConfiguration {
  return resolveFont(fonts, section, []);
}
