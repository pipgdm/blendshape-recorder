import React from 'react';
import { Canvas } from '@react-three/fiber';
import AvatarModel from './AvatarModel';
import * as THREE from 'three';


type Props = {
  blendshapes: { categoryName: string; score: number }[];
  rotation: THREE.Euler | null;
};

const AvatarCanvas: React.FC<Props> = ({ blendshapes, rotation }) => {
  return (
    <Canvas camera={{ fov: 20 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[2, 2, 5]} intensity={1} />
      <AvatarModel blendshapes={blendshapes} rotation={rotation} />
    </Canvas>
  );
};

export default AvatarCanvas;
