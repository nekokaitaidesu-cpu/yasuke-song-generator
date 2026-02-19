export type SectionType = 'intro' | 'chorus' | 'verse' | 'pre-chorus' | 'bridge' | 'outro';

export type VocalType = 'male' | 'female';

export interface Section {
  type: SectionType;
  label: string;
  lines: string[];
  maxLines: number;
  metaTags: string[];
}

export interface StructurePattern {
  id: string;
  name: string;
  description: string;
  sections: SectionType[];
}

export interface LyricState {
  pattern: StructurePattern;
  sections: Section[];
  title: string;
  currentSectionIndex: number;
  currentLineIndex: number;
}
