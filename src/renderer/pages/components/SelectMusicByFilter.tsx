import { MusicInterface } from 'interfaces/musicInterfaces';
import { useEffect, useState, useRef, useCallback } from 'react';
import { CircularProgress } from '@mui/material';
import { getAllMusics } from '../api';
import MusicCard from './MusicCard';
import FilterCard from './FilterCard';
import ContainerMain from './ContainerMain';
import ContainerCards from './ContainerCards';

interface Props {
  filters: string[];
}

export default function SelectMusicByFilter({ filters }: Props) {
  const [musics, setMusics] = useState<MusicInterface[]>();
  const [selected, setSelected] = useState<'music' | 'filter'>('music');
  const [musicIndex, setMusicIndex] = useState(0);
  const songRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [filterIndex, setFilterIndex] = useState(0);
  const [debounceTimeoutId, setDebounceTimeoutId] =
    useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    getAllMusics((arg) => {
      if (Array.isArray(arg)) {
        setMusics(arg);
      }
    });
  }, []);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (debounceTimeoutId) {
        clearTimeout(debounceTimeoutId);
      }
      setDebounceTimeoutId(
        setTimeout(() => {
          if (event.key === 'ArrowDown') {
            if (selected === 'music') {
              setMusicIndex((prevIndex) =>
                prevIndex < musics.length - 1 ? prevIndex + 1 : prevIndex
              );
            } else {
              setFilterIndex((prevIndex) =>
                prevIndex < filters.length - 1 ? prevIndex + 1 : prevIndex
              );
            }
          } else if (event.key === 'ArrowUp') {
            if (selected === 'music') {
              setMusicIndex((prevIndex) =>
                prevIndex > 0 ? prevIndex - 1 : prevIndex
              );
            } else {
              setFilterIndex((prevIndex) =>
                prevIndex > 0 ? prevIndex - 1 : prevIndex
              );
            }
          } else if (event.key === 'j') {
            setSelected((prevSelected) =>
              prevSelected === 'music' ? 'filter' : 'music'
            );
          }
        }, 190)
      );
    },
    [musics, filters]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown, musicIndex]);

  useEffect(() => {
    songRefs.current[musicIndex]?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'nearest',
    });
  }, [musicIndex]);

  if (!musics) {
    return <CircularProgress />;
  }

  return (
    <ContainerMain>
      <ContainerCards
        width={900}
        height={500}
        isSelected={selected === 'music'}
      >
        {musics.map((music, index) => (
          <MusicCard
            musicName={music.name}
            artist={music.artist}
            key={music.id}
            isSelected={index === musicIndex && selected === 'music'}
            innerRef={(ref) => (songRefs.current[index] = ref)}
          />
        ))}
      </ContainerCards>
      <ContainerCards
        width={500}
        height={500}
        isSelected={selected === 'filter'}
      >
        {filters.map((filter, index) => (
          <FilterCard
            filterName={filter}
            key={filter}
            isSelected={index === filterIndex && selected === 'filter'}
          />
        ))}
      </ContainerCards>
    </ContainerMain>
  );
}
