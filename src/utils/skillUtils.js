export function groupSkillsByCategory(skills) {
  return skills.reduce((groups, skill) => {
    const category = skill.category || 'Autres compétences';
    return {
      ...groups,
      [category]: [...(groups[category] ?? []), skill],
    };
  }, {});
}
