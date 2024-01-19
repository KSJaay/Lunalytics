import { useState } from 'react';

const useTheme = () => {
  const initialTheme = localStorage.getItem('theme') || 'dark';
  const initialColor = localStorage.getItem('color') || 'green';

  const [theme, updateTheme] = useState({
    type: initialTheme,
    color: initialColor,
  });

  const isDark = theme?.type?.startsWith('dark');

  const setTheme = (input) => {
    window.localStorage.setItem('theme', input);
    document.documentElement.dataset.theme = input;

    return updateTheme({ ...theme, type: input });
  };

  const setColor = (color) => {
    window.localStorage.setItem('color', color);
    document.documentElement.dataset.color = color;

    return updateTheme({ ...theme, color });
  };

  return { theme, isDark, setTheme, setColor };
};

export default useTheme;
