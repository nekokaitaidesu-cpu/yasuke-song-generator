import { Section, SectionType, VocalType } from '../types';
import {
  INTRO_TAGS,
  OUTRO_TAGS,
  VERSE_PHRASES,
  PRECHORUS_PHRASES,
  CHORUS_FIRST_LINE,
  CHORUS_LINES,
  CHORUS_ENDING,
  BRIDGE_PHRASES,
  TITLE_STARTERS,
  TITLE_ENDERS,
} from '../data/dictionary';

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickRandomN<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

function filterUsed(pool: string[], used: Set<string>, minRequired: number): string[] {
  const available = pool.filter((p) => !used.has(p));
  return available.length >= minRequired ? available : pool;
}

export function getCandidatesForSection(
  sectionType: SectionType,
  lineIndex: number,
  isFirstChorus: boolean = false,
  usedPhrases: Set<string> = new Set(),
): string[] {
  switch (sectionType) {
    case 'intro':
      return pickRandomN([
        ...INTRO_TAGS,
        pickRandom(CHORUS_FIRST_LINE),
      ], 3);

    case 'chorus': {
      // 最初の行は必ずヤスケ！系を候補に含む
      if (lineIndex === 0) {
        return getChorusFirstLineCandidates();
      }
      // 最終行はサビ締め候補
      if (lineIndex === 3) {
        return getChorusEndingCandidates(isFirstChorus);
      }
      // 中間行
      return pickRandomN(CHORUS_LINES, 3);
    }

    case 'verse': {
      const available = filterUsed(VERSE_PHRASES, usedPhrases, 3);
      return pickRandomN(available, 3);
    }

    case 'pre-chorus': {
      const available = filterUsed(PRECHORUS_PHRASES, usedPhrases, 3);
      return pickRandomN(available, 3);
    }

    case 'bridge':
      return pickRandomN(BRIDGE_PHRASES, 3);

    case 'outro':
      return pickRandomN([
        ...OUTRO_TAGS,
        pickRandom(CHORUS_ENDING),
        pickRandom(CHORUS_LINES),
      ], 3);

    default:
      return pickRandomN(CHORUS_LINES, 3);
  }
}

// サビ第一行：必ずヤスケ！系を含む3候補
function getChorusFirstLineCandidates(): string[] {
  const yasukeLines = CHORUS_FIRST_LINE.filter((l) => l.includes('ヤスケ！'));
  const others = CHORUS_FIRST_LINE.filter((l) => !l.includes('ヤスケ！'));
  const picked = [pickRandom(yasukeLines), ...pickRandomN([...others, ...CHORUS_LINES], 2)];
  return picked.sort(() => Math.random() - 0.5);
}

// サビ最終行：最初のサビはヤスケ！系を必ず含む
function getChorusEndingCandidates(isFirstChorus: boolean): string[] {
  if (isFirstChorus) {
    const yasukeEnding = CHORUS_ENDING.filter((e) => e.includes('ヤスケ'));
    const others = CHORUS_ENDING.filter((e) => !e.includes('ヤスケ'));
    const picked = [pickRandom(yasukeEnding), ...pickRandomN(others, 2)];
    return picked.sort(() => Math.random() - 0.5);
  }
  return pickRandomN(CHORUS_ENDING, 3);
}

export function getRandomCandidate(sectionType: SectionType): string {
  if (sectionType === 'chorus') {
    return pickRandom(CHORUS_ENDING);
  }
  return pickRandom([...VERSE_PHRASES, ...CHORUS_LINES]);
}

export function generateTitle(): string {
  return `${pickRandom(TITLE_STARTERS)}${pickRandom(TITLE_ENDERS)}`;
}

export function generateSunoPrompt(title: string, sections: Section[], vocalType: VocalType): string {
  const vocalStyle = vocalType === 'male'
    ? 'Eurobeat, High Tempo, Electronic Dance, Male Vocals, Powerful, Shouting, Jidaigeki Anime Style, Dramatic, Heavy Bassline, Synthesizer Rush'
    : 'Eurobeat, High Tempo, Electronic Dance, Female Vocals, High Range, Emotional, Jidaigeki Anime Style, Dramatic, Heavy Bassline, Synthesizer Rush';

  const style = `【スタイル】
${vocalStyle}, Japanese Lyrics Only, Do not sing text in parentheses`;

  const titleSection = `【タイトル】\n${title}`;

  let lyrics = '【歌詞】\n';
  for (const section of sections) {
    lyrics += `\n[${section.label}]\n`;
    for (const tag of section.metaTags) {
      lyrics += `${tag}\n`;
    }
    for (const line of section.lines) {
      if (line === '（スキップ）') {
        lyrics += '\n';
      } else if (line.trim()) {
        lyrics += `${line}\n`;
      }
    }
  }

  return `${style}\n\n${titleSection}\n\n${lyrics}`;
}
