import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'light' | 'blue' | 'green' | 'amber';

interface ThemeState {
  theme: Theme;
  setTheme: (newTheme: Theme) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'light',
      setTheme: (newTheme) => {
        set({ theme: newTheme });

        // 테마에 따른 CSS 클래스 적용
        document.documentElement.classList.remove('theme-light', 'theme-blue', 'theme-green', 'theme-amber');
        document.documentElement.classList.add(`theme-${newTheme}`);
      },
    }),
    {
      name: 'podoreaders-theme',
      onRehydrateStorage: () => {
        // 저장된 테마가 있다면 로드 시 적용
        return (rehydratedState) => {
          if (rehydratedState) {
            document.documentElement.classList.remove('theme-light', 'theme-blue', 'theme-green', 'theme-amber');
            document.documentElement.classList.add(`theme-${rehydratedState.theme}`);
          }
        };
      },
    },
  ),
);
