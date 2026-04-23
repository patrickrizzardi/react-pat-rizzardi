interface ProjectBase {
  id: string;
  title: string;
  description: string;
  tech: ReadonlyArray<string>;
}

interface CodeSnippet {
  label: string;
  language: string;
  code: string;
}

export interface FeaturedProject extends ProjectBase {
  tier: 'featured';
  snippets: ReadonlyArray<CodeSnippet>;
  archNotes: string;
}

export interface ExperienceProject extends ProjectBase {
  tier: 'experience';
  role: string;
  period: string;
  responsibilities: ReadonlyArray<string>;
  highlights: ReadonlyArray<string>;
  liveUrl: string;
}

export interface StandardProject extends ProjectBase {
  tier: 'standard';
  repoUrl?: string;
  liveUrl?: string;
  npmUrl?: string;
  extensionUrl?: string;
}

export type Project = FeaturedProject | ExperienceProject | StandardProject;
