import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RecordScreen from './screens/RecordScreen';
import PlaybackScreen from './screens/PlaybackScreen';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RecordScreen />} />
        <Route path="/playback" element={<PlaybackScreen />} /> {/* 👈 Add this */}
      </Routes>
    </Router>
  );
}

export default App;
