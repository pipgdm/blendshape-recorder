import { useState, useRef } from 'react';

export function useRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const isRecordingRef = useRef(false); // ✅ new ref
  const recordedFrames = useRef<any[]>([]);

  const startRecording = () => {
    recordedFrames.current = [];
    isRecordingRef.current = true; // ✅ update ref
    setIsRecording(true);
    console.log('🔴 Start recording');
  };

  const stopRecording = () => {
    isRecordingRef.current = false; // ✅ update ref
    setIsRecording(false);
    console.log('🔴 Stop recording');
    return recordedFrames.current;
  };

  const addFrame = (blendshapes: any) => {
    if (isRecordingRef.current) {
      const frame = {
        timestamp: Date.now(),
        blendshapes,
      };
      recordedFrames.current.push(frame);
      console.log('➕ Adding frame', frame); // ✅ now it logs the actual frame
    }
  };
  

  const downloadFrames = () => {
    const blob = new Blob([JSON.stringify(recordedFrames, null, 2)], {
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
    downloadFrames
  };
}
