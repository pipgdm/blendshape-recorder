import { Euler, Matrix4 } from 'three';

import {
  FaceLandmarker,
  FaceLandmarkerOptions,
  FilesetResolver,
} from "@mediapipe/tasks-vision";

let faceLandmarker: FaceLandmarker | null = null;

const options: FaceLandmarkerOptions = {
  baseOptions: {
    modelAssetPath:
      "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
    delegate: "GPU",
  },
  runningMode: "VIDEO",
  numFaces: 1,
  outputFaceBlendshapes: true,
  outputFacialTransformationMatrixes: true,
};

export async function loadFaceLandmarker() {
  const filesetResolver = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
  );
  faceLandmarker = await FaceLandmarker.createFromOptions(
    filesetResolver,
    options
  );
  console.log("✅ MediaPipe face landmarker loaded");
}

export function getBlendshapesForVideo(video: HTMLVideoElement) {
  if (!faceLandmarker) return null;

  const nowInMs = Date.now();
  const result = faceLandmarker.detectForVideo(video, nowInMs);

  const blendshapes = result?.faceBlendshapes?.[0]?.categories ?? [];

  let rotation: Euler | null = null;
  const matrix = result?.facialTransformationMatrixes?.[0]?.data;
  if (matrix) {
    const rotMatrix = new Matrix4().fromArray(matrix);
    rotation = new Euler().setFromRotationMatrix(rotMatrix);
  }

  return {
    blendshapes,
    rotation, // ✅ Return the Euler rotation, not raw matrix
  };
}
