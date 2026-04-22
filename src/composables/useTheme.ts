import { ref, watchEffect } from 'vue';

const STORAGE_KEY = 'theme';

const getSystemPreference = (): boolean => window.matchMedia('(prefers-color-scheme: dark)').matches;

const getInitialTheme = (): boolean => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'dark') return true;
  if (stored === 'light') return false;
  return getSystemPreference();
};

const isDark = ref(getInitialTheme());

export const useTheme = (): { readonly isDark: typeof isDark; toggle: () => void } => {
  watchEffect(() => {
    document.documentElement.classList.toggle('dark', isDark.value);
    localStorage.setItem(STORAGE_KEY, isDark.value ? 'dark' : 'light');
  });

  const toggle = (): void => {
    isDark.value = !isDark.value;
  };

  return { isDark, toggle } as const;
};
