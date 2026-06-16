export const projectDetailSections = [
  { key: 'objective', title: 'Objectif' },
  { key: 'operation', title: 'Fonctionnement' },
  { key: 'strengths', title: 'Points forts' },
  { key: 'weaknesses', title: 'Points faibles' },
  { key: 'perspectives', title: 'Perspectives' },
];

export function parseProjectDescription(value) {
  const text = value ?? '';
  const details = { overview: text, sections: [] };

  projectDetailSections.forEach((section, index) => {
    const nextTitle = projectDetailSections[index + 1]?.title;
    const pattern = nextTitle
      ? new RegExp(`## ${section.title}\\n([\\s\\S]*?)(?=\\n## ${nextTitle}\\n)`)
      : new RegExp(`## ${section.title}\\n([\\s\\S]*)`);
    const match = text.match(pattern);
    if (match?.[1]?.trim()) {
      details.sections.push({ title: section.title, content: match[1].trim() });
    }
  });

  const firstSectionMatch = text.match(/(^|\n)## Objectif\n/);
  details.overview = firstSectionMatch
    ? text.slice(0, firstSectionMatch.index).trim()
    : text;

  return details;
}

export function parseProjectFields(value) {
  const text = value ?? '';
  const parsed = {
    full_description: text,
    objective: '',
    operation: '',
    strengths: '',
    weaknesses: '',
    perspectives: '',
  };

  projectDetailSections.forEach((section, index) => {
    const nextTitle = projectDetailSections[index + 1]?.title;
    const pattern = nextTitle
      ? new RegExp(`## ${section.title}\\n([\\s\\S]*?)(?=\\n## ${nextTitle}\\n)`)
      : new RegExp(`## ${section.title}\\n([\\s\\S]*)`);
    const match = text.match(pattern);
    if (match?.[1]) {
      parsed[section.key] = match[1].trim();
    }
  });

  const firstSectionMatch = text.match(/(^|\n)## Objectif\n/);
  parsed.full_description = firstSectionMatch
    ? text.slice(0, firstSectionMatch.index).trim()
    : text;

  return parsed;
}

export function buildProjectDescription(project) {
  const overview = project.full_description?.trim() ?? '';
  const sections = projectDetailSections
    .map((section) => {
      const content = project[section.key]?.trim();
      return content ? `## ${section.title}\n${content}` : '';
    })
    .filter(Boolean);
  return [overview, ...sections].filter(Boolean).join('\n\n');
}
