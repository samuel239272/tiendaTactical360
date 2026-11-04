import { useEffect, useState } from 'react';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import type { Group } from 'three';
import { disposeModel, validateModel } from '../utils/modelHelpers';
import { assetUrl } from '../utils/assets';
import type { ThreeEvent } from '@react-three/fiber';
import type { Vector3Tuple } from '../types/product';

export type ModelStatus = { state: 'loading' | 'ready' | 'error'; progress: number };
export function ModelLoader({
  url,
  scale = 1,
  onStatus,
  onFocus,
}: {
  url: string;
  scale?: number;
  onStatus: (status: ModelStatus) => void;
  onFocus: (point: Vector3Tuple) => void;
}) {
  const [model, setModel] = useState<Group | null>(null);
  useEffect(() => {
    let active = true;
    let loaded: Group | undefined;
    const draco = new DRACOLoader().setDecoderPath(assetUrl('/decoders/draco/'));
    const loader = new GLTFLoader().setDRACOLoader(draco).setMeshoptDecoder(MeshoptDecoder);
    onStatus({ state: 'loading', progress: 0 });
    loader.load(
      url,
      (gltf) => {
        if (!active) {
          disposeModel(gltf.scene);
          return;
        }
        loaded = gltf.scene;
        try {
          validateModel(loaded);
          setModel(loaded);
          onStatus({ state: 'ready', progress: 100 });
        } catch {
          disposeModel(loaded);
          loaded = undefined;
          onStatus({ state: 'error', progress: 0 });
        }
      },
      (event) => {
        if (active)
          onStatus({
            state: 'loading',
            progress: event.total ? Math.round((event.loaded / event.total) * 100) : 0,
          });
      },
      () => {
        if (active) onStatus({ state: 'error', progress: 0 });
      },
    );
    return () => {
      active = false;
      draco.dispose();
      if (loaded) disposeModel(loaded);
    };
  }, [url, onStatus]);
  if (!model) return null;
  return (
    <primitive
      object={model}
      scale={scale}
      dispose={null}
      onDoubleClick={(event: ThreeEvent<MouseEvent>) => {
        event.stopPropagation();
        onFocus(event.point.toArray());
      }}
    />
  );
}
