import React, { useEffect, useRef, useState } from 'react';
import AvatarCanvas from '../components/AvatarCanvas';

const PlaybackScreen: React.FC = () => {
  const [frames, setFrames] = useState<any[]>([]);
  const [currentBlendshapes, setCurrentBlendshapes] = useState<any[]>([]);
  const frameIndexRef = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
  
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target?.result as string);
        console.log('📂 Parsed JSON:', parsed);
        setFrames(parsed.current);
      } catch (err) {
        console.error('❌ Failed to parse JSON:', err);
      }
    };
  
    reader.readAsText(file);
  };
  

  const startPlayback = () => {
    if (!frames.length) return;

    frameIndexRef.current = 0;

    intervalRef.current = setInterval(() => {
      const frame = frames[frameIndexRef.current];
      if (frame) {
        setCurrentBlendshapes(frame.blendshapes);
        frameIndexRef.current++;
      } else {
        clearInterval(intervalRef.current!);
      }
    }, 1000 / 24); // 24 FPS
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <input type="file" accept=".json" onChange={handleFileUpload} />
      <button onClick={startPlayback} disabled={!frames.length}>Play</button>

      <div style={{ width: 500, height: 500, margin: '0 auto' }}>
        <AvatarCanvas blendshapes={currentBlendshapes} />
      </div>
    </div>
  );
};

export default PlaybackScreen;
