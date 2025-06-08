import React, { useEffect, useRef, useState } from 'react';
import { loadFaceLandmarker, getBlendshapesForVideo } from '../services/mediapipeService';
import AvatarCanvas from '../components/AvatarCanvas';
import { useRecorder } from '../hooks/useRecorder';
import { useNavigate } from 'react-router-dom';

const RecordScreen: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const frameCountRef = useRef(0);
  const [startTime] = useState(Date.now());
  const [latestBlendshapes, setLatestBlendshapes] = useState<{ categoryName: string; score: number }[]>([]);
  const { isRecording, startRecording, stopRecording, addFrame, downloadFrames } = useRecorder();
  const navigate = useNavigate();

  // 1. Load MediaPipe model and start webcam
  useEffect(() => {
    const setup = async () => {
      await loadFaceLandmarker();

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        console.log('📷 Webcam stream attached');
      }
    };

    setup();
  }, []);

  // 2. Start prediction loop
  useEffect(() => {
    const predict = () => {
      if (!videoRef.current || videoRef.current.videoWidth === 0) {
        requestAnimationFrame(predict);
        return;
      }

      console.log('🌀 Predict loop running');

      const result = getBlendshapesForVideo(videoRef.current);
      if (result?.blendshapes.length) {
        //console.log('🟢 Blendshapes:', result.blendshapes);
        setLatestBlendshapes(result.blendshapes);
      }

      if (result?.blendshapes.length) {
        //console.log('🟢 Blendshapes:', result.blendshapes);
        addFrame(result.blendshapes);
      }
      

      frameCountRef.current++;
      const elapsed = (Date.now() - startTime) / 1000;
      const fps = (frameCountRef.current / elapsed).toFixed(1);
      //console.log(`⏱ Frames: ${frameCountRef.current} | FPS: ${fps}`);

      requestAnimationFrame(predict);
    };

    predict();
  }, []);

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 20 }}>
        {/* Webcam */}
        <div style={{ width: 500, height: 500, position: 'relative', overflow: 'hidden' }}>
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            id="video"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </div>
  
        {/* Avatar */}
        <div style={{ width: 500, height: 500 }}>
          <AvatarCanvas blendshapes={latestBlendshapes} />
        </div>
      </div>
  
      <div
        style={{
          position: 'absolute',
          bottom: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 2,
        }}
      >
        <button
            onClick={() => {
                if (isRecording) {
                const frames = stopRecording();
                console.log('💾 Recorded frames:', frames);
                downloadFrames(); // ✅ Download JSON
                } else {
                startRecording();
                }
            }}
            >
            {isRecording ? 'Stop Recording' : 'Start Recording'}
        </button>
        <button onClick={() => navigate('/playback')}>
            Go to Playback
        </button>

      </div>
    </>
  );
  
};

export default RecordScreen;
