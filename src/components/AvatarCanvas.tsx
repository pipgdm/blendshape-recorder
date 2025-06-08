import React from 'react';
import { Canvas } from '@react-three/fiber';
import AvatarModel from './AvatarModel';

type Props = {
  blendshapes: { categoryName: string; score: number }[];
};

const AvatarCanvas: React.FC<Props> = ({ blendshapes }) => {
  return (
    <Canvas camera={{ fov: 20 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[2, 2, 5]} intensity={1} />
      <AvatarModel blendshapes={blendshapes} />
    </Canvas>
  );
};

export default AvatarCanvas;
