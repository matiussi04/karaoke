export interface MusicInterface {
  name: string;
  id: string;
  artist: string;
}

export interface CapaInterface {
  style: string;
  artist: string;
}

export interface getSingleMusicParamsInterface {
  styleId: number;
  artistId: number;
  musicId: number;
}

export interface singleMusicOutputInterface {
  style: string;
  artist: string;
  music: MusicInterface;
}

export function isgetSingleMusicParamsInterface(
  arg: unknown
): arg is getSingleMusicParamsInterface {
  if (typeof arg === 'object' && arg !== null) {
    const { styleId, artistId, musicId } = arg as getSingleMusicParamsInterface;
    return (
      typeof styleId === 'number' &&
      typeof artistId === 'number' &&
      typeof musicId === 'number'
    );
  }
  return false;
}

export function isMusicInterface(arg: unknown): arg is MusicInterface {
  if (typeof arg === 'object' && arg !== null) {
    const { name, id, artist } = arg as MusicInterface;
    return (
      typeof name === 'string' &&
      typeof id === 'string' &&
      typeof artist === 'string'
    );
  }
  return false;
}

export function isSingleMusicOutputInterface(
  arg: unknown
): arg is singleMusicOutputInterface {
  if (typeof arg === 'object' && arg !== null) {
    const { style, artist, music } = arg as singleMusicOutputInterface;
    return (
      typeof style === 'string' &&
      typeof artist === 'string' &&
      isMusicInterface(music)
    );
  }
  return false;
}
