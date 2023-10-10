/* eslint-disable no-console */
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import SelectMusicByStyleWindow from './pages/SelectMusicByStyleWindow';
import PlayMusicWindow from './pages/PlayMusicWindow';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/play-music" element={<PlayMusicWindow />} />
        <Route path="/" element={<SelectMusicByStyleWindow />} />
      </Routes>
    </Router>
  );
}
