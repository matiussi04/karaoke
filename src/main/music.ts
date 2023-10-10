import {
  CapaInterface,
  MusicInterface,
  getSingleMusicParamsInterface,
  singleMusicOutputInterface,
} from 'interfaces/musicInterfaces';
import { readdirSync } from 'fs';
import path from 'path';
import { resolveMusicPath } from './util';

export function getDirectoryPath(
  style?: string,
  artist?: string,
  music?: string
) {
  if (style) {
    if (artist) {
      if (music) {
        return path.join(resolveMusicPath(), style, artist, music);
      }
      return path.join(resolveMusicPath(), style, artist);
    }
    return path.join(resolveMusicPath(), style);
  }
  return path.join(resolveMusicPath());
}

export function getAllMusicStyles(): string[] {
  const styles = readdirSync(getDirectoryPath());

  return styles;
}

export function getAllMusicArtists(styleFilter?: string): string[] {
  const styles = getAllMusicStyles();
  let artists: string[] = [];

  styles.forEach((style) => {
    if (!styleFilter || style === styleFilter) {
      artists = artists.concat(readdirSync(getDirectoryPath(style)));
    }
  });

  return artists;
}

export function getAllCapas(): CapaInterface[] {
  const capas: CapaInterface[] = [];
  const styles = getAllMusicStyles();

  styles.forEach((style) => {
    const artists = getAllMusicArtists(style);

    artists.forEach((artist) => {
      readdirSync(getDirectoryPath(style, artist)).forEach((file) => {
        if (file.includes('.jpg')) {
          capas.push({
            style,
            artist,
          });
        }
      });
    });
  });

  return capas;
}

export function getAllMusics(styleFilter?: string, artistFilter?: string) {
  const musics: MusicInterface[] = [];
  const styles = getAllMusicStyles();

  styles.forEach((style, indexStyle) => {
    if (!styleFilter || style === styleFilter) {
      const artists = getAllMusicArtists(style);

      artists.forEach((artist, indexArtist) => {
        if (!artistFilter || artist === artistFilter) {
          readdirSync(getDirectoryPath(style, artist)).forEach(
            (music, indexMusic) => {
              if (!music.includes('.jpg')) {
                musics.push({
                  name: music,
                  id: `${indexStyle}-${indexArtist}-${indexMusic}`,
                  artist,
                });
              }
            }
          );
        }
      });
    }
  });

  return musics;
}

export function getSingleMusic({
  styleId,
  artistId,
  musicId,
}: getSingleMusicParamsInterface): singleMusicOutputInterface | null {
  const style = getAllMusicStyles()[styleId];

  if (!style) {
    return null;
  }

  const artist = getAllMusicArtists(style)[artistId];

  if (!artist) {
    return null;
  }

  const music = getAllMusics(style, artist)[musicId];

  if (!music) {
    return null;
  }

  return {
    style,
    artist,
    music,
  };
}
