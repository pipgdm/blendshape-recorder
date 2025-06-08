import React, { useEffect, useState } from 'react';
import { useRive } from '@rive-app/react-canvas';
import { setupRiveInputs, RiveInputs } from '../controllers/RiveController';

type Props = {
  rotation: { x: number; y: number; z: number } | null;
};

const RiveAvatar: React.FC<Props> = ({ rotation }) => {
  const stateMachineName = 'State Machine 1';
  const [inputs, setInputs] = useState<RiveInputs>({});

  const { rive, RiveComponent } = useRive({
    src: '/rive/simple_face_rotation.riv',
    stateMachines: stateMachineName,
    autoplay: true,
  });

  // 🧠 Wait until Rive is fully ready
  useEffect(() => {
    if (rive && Object.keys(inputs).length === 0) {
      const inputMap = setupRiveInputs(rive, stateMachineName);
  
      if (Object.keys(inputMap).length > 0) {
        console.log("🔥 Rive inputs loaded:", Object.keys(inputMap));
        setInputs(inputMap);
      }
    }
  }, [rive]);
  

  // 🎯 Update look inputs when rotation changes
  useEffect(() => {
    if (!rotation || !inputs) return;
  
    const y = rotation.y;
    const scale = 600;
    const left = Math.max(0, -y * scale);
    const right = Math.max(0, y * scale);
  
    console.log("🎯 Rotation Y:", y, "| L:", left, "R:", right); // ✅ now works
  
    if (inputs.look_left && inputs.look_right) {
      inputs.look_left.value = left;
      inputs.look_right.value = right;
    }
  }, [rotation, inputs]);
  

  return (
    <div style={{ width: 400, height: 400 }}>
      <RiveComponent />
    </div>
  );
};

export default RiveAvatar;
