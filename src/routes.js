import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MediaRecorderApp from './pages/MediaRecorderApp';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MediaRecorderApp/>} />
      </Routes>
    </BrowserRouter>
  );
}
