import { StructurePattern, Section, SectionType } from '../types';

export const STRUCTURE_PATTERNS: StructurePattern[] = [
  {
    id: 'pattern1',
    name: '陣形・甲',
    description: 'イントロ → サビ → Ａメロ → Ｂメロ → サビ',
    sections: ['intro', 'chorus', 'verse', 'pre-chorus', 'chorus'],
  },
  {
    id: 'pattern2',
    name: '陣形・乙',
    description: 'サビ → Ａメロ → Ｂメロ → サビ → ブリッジ → サビ',
    sections: ['chorus', 'verse', 'pre-chorus', 'chorus', 'bridge', 'chorus'],
  },
];

export const SECTION_CONFIG: Record<SectionType, { label: string; maxLines: number; metaTags: string[] }> = {
  intro: {
    label: 'Intro',
    maxLines: 2,
    metaTags: ['(Taiko drum roll -> Shamisen riff)', '(High-speed Eurobeat ignition)'],
  },
  chorus: {
    label: 'Chorus',
    maxLines: 4,
    metaTags: [
      '(Key: Minor, Driving, Dramatic)',
      '(Full synth, Shout vocals, Taiko barrage)',
    ],
  },
  verse: {
    label: 'Verse',
    maxLines: 4,
    metaTags: ['(Key: Major, Storytelling, High Tempo)', '(Rhythm: Fast Beat)'],
  },
  'pre-chorus': {
    label: 'Pre-Chorus',
    maxLines: 2,
    metaTags: ['(Rising tension, Drum roll)', '(Rhythm: Accelerating)'],
  },
  bridge: {
    label: 'Bridge',
    maxLines: 3,
    metaTags: ['(Breakdown, Emotional, Shamisen solo)', '(Rhythm: Free, Dramatic)'],
  },
  outro: {
    label: 'Outro',
    maxLines: 2,
    metaTags: ['(Final roar)', '(Repeat -> Fade out)'],
  },
};

export function createSectionsFromPattern(pattern: StructurePattern): Section[] {
  const chorusCount: Record<string, number> = {};
  return pattern.sections.map((type) => {
    const config = SECTION_CONFIG[type];
    chorusCount[type] = (chorusCount[type] || 0) + 1;
    const suffix = chorusCount[type] > 1 ? ` ${chorusCount[type]}` : '';
    return {
      type,
      label: `${config.label}${suffix}`,
      lines: Array(config.maxLines).fill(''),
      maxLines: config.maxLines,
      metaTags: [...config.metaTags],
    };
  });
}

export function createSectionFromType(type: SectionType, existingSections: Section[]): Section {
  const config = SECTION_CONFIG[type];
  const count = existingSections.filter((s) => s.type === type).length + 1;
  const suffix = count > 1 ? ` ${count}` : '';
  return {
    type,
    label: `${config.label}${suffix}`,
    lines: Array(config.maxLines).fill(''),
    maxLines: config.maxLines,
    metaTags: [...config.metaTags],
  };
}

export const ALL_SECTION_TYPES: SectionType[] = ['intro', 'verse', 'pre-chorus', 'chorus', 'bridge', 'outro'];
