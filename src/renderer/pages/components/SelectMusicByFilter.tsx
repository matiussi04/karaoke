import { MusicInterface } from 'interfaces/musicInterfaces';
import { useEffect, useState, useRef } from 'react';
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
  const [event, setEvent] = useState<boolean>(false);
  const [musicIndex, setMusicIndex] = useState(0);
  const innerRef = useRef(null);
  const innerRef2 = useRef(null);
  const selectMusic = useRef(null);

  useEffect(() => {
    getAllMusics((arg) => {
      if (Array.isArray(arg)) {
        setMusics(arg);
      }
    });
  }, []);

  if (!musics) {
    return <CircularProgress />;
  }

  function checkVisible(
    listElement: HTMLElement | null,
    selectedItem: HTMLElement | null
  ) {
    if (listElement && selectedItem) {
      const selectedItemTop = selectedItem.offsetTop;
      const selectedItemBottom =
        selectedItem.offsetTop + selectedItem.offsetHeight;

      const { scrollTop } = listElement;
      const scrollBottom = scrollTop + listElement.offsetHeight;

      // Se o item estiver fora da área visível na parte de cima, faz o scroll para cima
      if (selectedItemTop < scrollTop) {
        selectedItem.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      // Se o item estiver fora da área visível na parte de baixo, faz o scroll para baixo
      else if (selectedItemBottom > scrollBottom) {
        selectedItem.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }
    }
  }

  const handleKeyPress = (e: any) => {
    if (e.key === 'w') {
      setMusicIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : prevIndex));
    } else if (e.key === 's') {
      setMusicIndex((prevIndex) =>
        prevIndex < musics.length - 1 ? prevIndex + 1 : prevIndex
      );
    }
    if (e.key === 'j') {
      setSelected((value) => (value === 'music' ? 'filter' : 'music'));
    }
  };

  if (!event) {
    setEvent(true);
    document.addEventListener('keydown', handleKeyPress);
  }

  checkVisible(innerRef.current, selectMusic.current);

  return (
    <ContainerMain>
      <ContainerCards
        width={900}
        height={500}
        isSelected={selected === 'music'}
        innerRef={innerRef}
      >
        {musics.map((music, index) => (
          <MusicCard
            musicName={music.name}
            artist={music.artist}
            key={music.id}
            isSelected={index === musicIndex && selected === 'music'}
            innerRef={index === musicIndex ? selectMusic : null}
          />
        ))}
      </ContainerCards>
      <ContainerCards
        width={500}
        height={500}
        innerRef={innerRef2}
        isSelected={selected === 'filter'}
      >
        {filters.map((filter, index) => (
          <FilterCard
            filterName={filter}
            key={filter}
            isSelected={index === musicIndex && selected === 'filter'}
          />
        ))}
      </ContainerCards>
    </ContainerMain>
  );
}
