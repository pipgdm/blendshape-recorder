import React, { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const AVATAR_URL = 'https://models.readyplayer.me/6460d95f9ae10f45bffb2864.glb?morphTargets=ARKit&textureAtlas=1024';

type Props = {
  blendshapes: { categoryName: string; score: number }[];
  rotation: THREE.Euler | null; // 👈 New prop
};

const AvatarModel: React.FC<Props> = ({ blendshapes, rotation }) => {
  const { scene, nodes } = useGLTF(AVATAR_URL, true);
  const meshRefs = useRef<THREE.Mesh[]>([]);

  useEffect(() => {
    meshRefs.current = [];
    Object.values(nodes).forEach((node: any) => {
      if (node.isMesh && node.morphTargetInfluences) {
        meshRefs.current.push(node);
      }
    });
  }, [nodes]);

  useFrame(() => {
    // 🎯 Blendshapes
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

    // 🌀 Rotation
    if (rotation && nodes.Head && nodes.Neck && nodes.Spine2) {
      nodes.Head.rotation.set(rotation.x, rotation.y, rotation.z);
      nodes.Neck.rotation.set(rotation.x / 5 + 0.3, rotation.y / 5, rotation.z / 5);
      nodes.Spine2.rotation.set(rotation.x / 10, rotation.y / 10, rotation.z / 10);
    }
  });

  return <primitive object={scene} scale={2.3} position={[0, -3.9, 1.5]} />;
};

export default AvatarModel;
