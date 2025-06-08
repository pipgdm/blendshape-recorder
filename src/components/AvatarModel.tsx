import React, { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const AVATAR_URL = 'https://models.readyplayer.me/6460d95f9ae10f45bffb2864.glb?morphTargets=ARKit&textureAtlas=1024';

type Props = {
  blendshapes: { categoryName: string; score: number }[];
};

const AvatarModel: React.FC<Props> = ({ blendshapes }) => {
  const { scene, nodes } = useGLTF(AVATAR_URL, true);
  const meshRefs = useRef<THREE.Mesh[]>([]);

  // Collect morphable meshes once
  useEffect(() => {
    meshRefs.current = [];
    Object.values(nodes).forEach((node: any) => {
      if (node.isMesh && node.morphTargetInfluences) {
        meshRefs.current.push(node);
      }
    });
  }, [nodes]);

  // Animate morph targets using blendshapes
  useFrame(() => {
    if (!blendshapes || blendshapes.length === 0) return;

    for (const mesh of meshRefs.current) {
      const dict = mesh.morphTargetDictionary;
      const influences = mesh.morphTargetInfluences;

      blendshapes.forEach(({ categoryName, score }) => {
        const index = dict?.[categoryName];
        if (index !== undefined && influences) {
          influences[index] = score;
        }
      });
    }
  });

  return <primitive object={scene} scale={2.3} position={[0, -3.9, 1.5]} />;
};

export default AvatarModel;
