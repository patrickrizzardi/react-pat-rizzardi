import type { DefineComponent } from 'vue';
import type { BlogFrontmatter, BlogPost } from '@/types/blog';

const WORDS_PER_MINUTE = 200;

interface BlogModule {
  default: DefineComponent;
  title: string;
  date: string;
  description: string;
  tags: ReadonlyArray<string>;
  slug: string;
  author?: string;
  draft?: boolean;
}

const modules = import.meta.glob<BlogModule>('../content/blog/*.md', {
  eager: true,
});

const estimateReadingTime = (content: string): number => {
  const words = content.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
};

const allPosts: ReadonlyArray<BlogPost> = Object.entries(modules)
  .map(([path, mod]) => {
    const frontmatter: BlogFrontmatter = {
      title: mod.title,
      date: mod.date,
      description: mod.description,
      tags: mod.tags,
      slug: mod.slug,
      author: mod.author ?? 'Patrick Rizzardi',
      ...(mod.draft !== undefined && { draft: mod.draft }),
    };
    return {
      frontmatter,
      readingTime: estimateReadingTime(path),
      component: mod.default,
    };
  })
  .filter((post) => !post.frontmatter.draft)
  .sort((a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime());

interface UseBlogPostsReturn {
  readonly posts: ReadonlyArray<BlogPost>;
  readonly getBySlug: (slug: string) => BlogPost | undefined;
  readonly getAllTags: () => ReadonlyArray<string>;
}

export const useBlogPosts = (): UseBlogPostsReturn => {
  const getBySlug = (slug: string): BlogPost | undefined => allPosts.find((post) => post.frontmatter.slug === slug);

  const getAllTags = (): ReadonlyArray<string> => {
    const tags = new Set<string>();
    for (const post of allPosts) {
      for (const tag of post.frontmatter.tags) {
        tags.add(tag);
      }
    }
    return [...tags].sort();
  };

  return { posts: allPosts, getBySlug, getAllTags } as const;
};
