import { useEffect, useState } from 'react';
import {
  Box,
  CircularProgress,
  CssBaseline,
  ThemeProvider,
} from '@mui/material';
import theme from 'renderer/theme';
import { isSingleMusicOutputInterface } from 'interfaces/musicInterfaces';
import { getSingleMusic } from './api';
import VideoPlayer from './components/VideoPlayer';

export default function PlayMusicWindow() {
  const [src, setSrc] = useState('');

  useEffect(() => {
    getSingleMusic(
      {
        styleId: 0,
        artistId: 0,
        musicId: 0,
      },
      async (arg) => {
        try {
          if (isSingleMusicOutputInterface(arg)) {
            const { style, artist, music } = arg;
            const module = await import(
              `../../../assets/music/${style}/${artist}/${music.name}`
            );
            setSrc(module.default);
          }
        } catch (error) {
          /* eslint no-console: ["error", { allow: ["warn", "error"] }] */

          console.error(error);
        }
      }
    );
  }, []);

  if (src === '') {
    return <CircularProgress />;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          backgroundColor: theme.palette.background.default,
        }}
      >
        <main>
          <VideoPlayer src={src} />
        </main>
      </Box>
    </ThemeProvider>
  );
}
