import { useState, useRef } from 'react';

type RecordedFrame = {
  timestamp: number;
  blendshapes: { categoryName: string; score: number }[];
  rotation: { x: number; y: number; z: number } | null;
};

export function useRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const isRecordingRef = useRef(false);
  const recordedFrames = useRef<RecordedFrame[]>([]);

  const startRecording = () => {
    recordedFrames.current = [];
    isRecordingRef.current = true;
    setIsRecording(true);
    console.log('🔴 Start recording');
  };

  const stopRecording = () => {
    isRecordingRef.current = false;
    setIsRecording(false);
    console.log('🔴 Stop recording');
    return recordedFrames.current;
  };

  const addFrame = (
    blendshapes: { categoryName: string; score: number }[],
    rotation: { x: number; y: number; z: number } | null
  ) => {
    if (isRecordingRef.current) {
      const frame = {
        timestamp: Date.now(),
        blendshapes,
        rotation,
      };
      recordedFrames.current.push(frame);
      console.log('➕ Adding frame', frame);
    }
  };

  const downloadFrames = () => {
    const blob = new Blob([JSON.stringify(recordedFrames.current, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `blendshape_recording_${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return {
    isRecording,
    startRecording,
    stopRecording,
    addFrame,
    downloadFrames,
  };
}
