import { useEffect, useState } from 'react';
import { CircularProgress, CssBaseline, ThemeProvider } from '@mui/material';
import theme from 'renderer/theme';
import { getStyles } from './api';
import SelectMusicByFilter from './components/SelectMusicByFilter';

export default function SelectMusicByStyleWindow() {
  const [styles, setStyles] = useState<string[]>();

  useEffect(() => {
    getStyles((arg) => {
      if (Array.isArray(arg)) {
        setStyles(arg);
      }
    });
  });

  if (!styles) {
    return <CircularProgress />;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SelectMusicByFilter filters={styles} />
    </ThemeProvider>
  );
}
