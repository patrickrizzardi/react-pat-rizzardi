import type { DefineComponent } from 'vue';

export interface BlogFrontmatter {
  title: string;
  date: string;
  description: string;
  tags: ReadonlyArray<string>;
  slug: string;
  author?: string;
  draft?: boolean;
}

export interface BlogPost {
  frontmatter: BlogFrontmatter;
  readingTime: number;
  component: DefineComponent;
}
