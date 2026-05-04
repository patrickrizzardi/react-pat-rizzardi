import { computed, toValue } from 'vue';
import { useSeoMeta } from '@unhead/vue';
import type { MaybeRefOrGetter } from 'vue';
import { siteConfig } from '@/data/siteConfig';

const DEFAULT_IMAGE = `${siteConfig.siteUrl}/assets/og-default.png`;

interface SeoOptions {
  title: MaybeRefOrGetter<string>;
  description: MaybeRefOrGetter<string>;
  url?: MaybeRefOrGetter<string>;
  image?: MaybeRefOrGetter<string>;
  type?: 'website' | 'article';
  article?: {
    author?: MaybeRefOrGetter<string>;
    publishedTime?: MaybeRefOrGetter<string>;
    tags?: MaybeRefOrGetter<ReadonlyArray<string>>;
  };
}

export const useSeo = (options: SeoOptions): void => {
  useSeoMeta({
    title: options.title,
    description: options.description,
    ogTitle: options.title,
    ogDescription: options.description,
    ogImage: options.image ?? DEFAULT_IMAGE,
    ogUrl: options.url ?? siteConfig.siteUrl,
    ogType: options.type ?? 'website',
    ogSiteName: siteConfig.name,
    twitterCard: 'summary_large_image',
    twitterTitle: options.title,
    twitterDescription: options.description,
    twitterImage: options.image ?? DEFAULT_IMAGE,
    ...(options.article && {
      articleAuthor: computed(() => {
        const author = options.article?.author;
        return author ? [toValue(author)] : undefined;
      }),
      articlePublishedTime: options.article.publishedTime,
    }),
  });
};
