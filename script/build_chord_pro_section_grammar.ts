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
  const sectionsGrammars = sections.map(([name, shortTags]) => {
    const sectionName = capitalize(name);
    const startTag = sectionTags(name, shortTags, 'start');
    const endTag = sectionTags(name, shortTags, 'end');

    return `
${sectionName}Section
  = startTag:${sectionName}StartTag
    NewLine
    content:$(!${sectionName}EndTag SectionCharacter)*
    endTag:${sectionName}EndTag
    {
      return helpers.buildSection(startTag, endTag, content);
    }

${sectionName}StartTag
  = "{" _ tagName:(${startTag}) selector:TagSelector? _ tagColonWithValue:TagColonWithValue? _ "}" {
      return helpers.buildTag(tagName, tagColonWithValue, selector, location());
    }

${sectionName}EndTag
  = "{" _ tagName:(${endTag}) _ "}" {
      return helpers.buildTag(tagName, null, null, location());
    }
`;
  });

  return `
Section
  = ${sections.map(([name, _shortTags]) => sectionRuleName(name)).join(' / ')}

${sectionsGrammars.join('\n\n')}

SectionCharacter
  = .
`.substring(1);
}
