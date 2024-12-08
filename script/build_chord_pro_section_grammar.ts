import sections from '../data/sections';

interface BuildOptions {
  force: boolean;
  release: boolean;
}

function capitalize(string: string) {
  return `${string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()}`;
}

function sectionRuleName(sectionName: string) {
  return `${capitalize(sectionName)}Section`;
}

function sectionShortTag(sectionName: string, type: 'start' | 'end'): string {
  return `${type[0]}o${sectionName[0]}`;
}

function sectionTags(sectionName: string, shortTag: boolean, type: 'start' | 'end') {
  const tags = [`${type}_of_${sectionName}`];
  if (shortTag) tags.push(sectionShortTag(sectionName, type));
  return tags.map((tag) => `"${tag}"`).join(' / ');
}

export default function buildChordProSectionGrammar(_: BuildOptions, _data: string): string {
  const sectionsGrammars = sections.map(([name, shortTags]) => `
${capitalize(name)}Section
  = startTag:${capitalize(name)}StartTag
    NewLine
    content:$(!${capitalize(name)}EndTag SectionCharacter)*
    endTag:${capitalize(name)}EndTag
    {
      return helpers.buildSection(startTag, endTag, content);
    }

${capitalize(name)}StartTag
  = "{" _ tagName:(${sectionTags(name, shortTags, 'start')}) _ tagColonWithValue: TagColonWithValue? _ "}" {
      return helpers.buildTag(tagName, tagColonWithValue, location());
    }

${capitalize(name)}EndTag
  = "{" _ tagName:(${sectionTags(name, shortTags, 'end')}) _ "}" {
      return helpers.buildTag(tagName, null, location());
    }
`);

  return `
Section
  = ${sections.map(([name, _shortTags]) => sectionRuleName(name)).join(' / ')}

${sectionsGrammars.join('\n\n')}

SectionCharacter
  = .
`.substring(1);
}
