import { computed, toValue } from 'vue';
import { useSeoMeta } from '@unhead/vue';
import type { MaybeRefOrGetter } from 'vue';

const SITE_NAME = 'Patrick Rizzardi';
const SITE_URL = 'https://redact.digital';
const DEFAULT_IMAGE = `${SITE_URL}/assets/og-default.png`;

interface SeoOptions {
  title: MaybeRefOrGetter<string>;
  description: MaybeRefOrGetter<string>;
  url?: MaybeRefOrGetter<string>;
  image?: MaybeRefOrGetter<string>;
  type?: 'website' | 'article';
  article?: {
    author?: MaybeRefOrGetter<string>;
    publishedTime?: MaybeRefOrGetter<string>;
  };
}

export const useSeo = (options: SeoOptions): void => {
  useSeoMeta({
    title: options.title,
    description: options.description,
    ogTitle: options.title,
    ogDescription: options.description,
    ogImage: options.image ?? DEFAULT_IMAGE,
    ogUrl: options.url ?? SITE_URL,
    ogType: options.type ?? 'website',
    ogSiteName: SITE_NAME,
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
