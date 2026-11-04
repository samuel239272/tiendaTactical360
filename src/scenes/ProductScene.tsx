import { Component, useState, type ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import { AdaptiveDpr } from '@react-three/drei';
import { ACESFilmicToneMapping } from 'three';
import { Lighting } from './Lighting';
import { ModelLoader, type ModelStatus } from './ModelLoader';
import { CameraController } from './CameraController';
import { Hotspots } from '../components/hotspots/Hotspots';
import { CAMERA_PRESETS, type CameraCommand } from '../types/viewer';
import type { TacticalProduct, Vector3Tuple } from '../types/product';

class SceneBoundary extends Component<
  { children: ReactNode; onError: () => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}
export default function ProductScene({
  product,
  command,
  visible,
  showHotspots,
  selectedId,
  reducedMotion,
  onSelect,
  onStatus,
  onFocus,
}: {
  product: TacticalProduct;
  command: CameraCommand;
  visible: boolean;
  showHotspots: boolean;
  selectedId?: string;
  reducedMotion: boolean;
  onSelect: (id: string) => void;
  onStatus: (status: ModelStatus) => void;
  onFocus: (point: Vector3Tuple) => void;
}) {
  const [dpr] = useState(() =>
    Math.min(window.devicePixelRatio, window.innerWidth < 768 ? 1.25 : 1.75),
  );
  return (
    <SceneBoundary onError={() => onStatus({ state: 'error', progress: 0 })}>
      <Canvas
        aria-label={`Modelo 3D de ${product.name}`}
        frameloop={visible ? 'demand' : 'never'}
        dpr={[1, dpr]}
        camera={{ position: CAMERA_PRESETS.perspective, fov: 35, near: 0.1, far: 50 }}
        gl={{
          antialias: true,
          alpha: true,
          toneMapping: ACESFilmicToneMapping,
          toneMappingExposure: 1.05,
        }}
        onCreated={({ gl }) => {
          gl.domElement.addEventListener(
            'webglcontextlost',
            () => onStatus({ state: 'error', progress: 0 }),
            { once: true },
          );
        }}
      >
        <Lighting />
        {product.model3D && (
          <ModelLoader
            url={product.model3D.exterior}
            scale={product.model3D.scale}
            onStatus={onStatus}
            onFocus={onFocus}
          />
        )}
        <CameraController
          command={command}
          reducedMotion={reducedMotion}
          interior={Boolean(product.model3D?.hasInterior)}
        />
        {showHotspots && (
          <group scale={product.model3D?.scale ?? 1}>
            <Hotspots components={product.components} selectedId={selectedId} onSelect={onSelect} />
          </group>
        )}
        <AdaptiveDpr pixelated />
      </Canvas>
    </SceneBoundary>
  );
}
