import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import {
  Box,
  Expand,
  Minimize,
  Minus,
  Plus,
  RotateCcw,
  Scan,
  X,
  MousePointer2,
  CircleHelp,
  LoaderCircle,
} from 'lucide-react';
import type { TacticalProduct, Vector3Tuple } from '../../types/product';
import {
  CAMERA_PRESETS,
  PRESET_LABELS,
  type CameraCommand,
  type CameraPreset,
  type InspectionMode,
} from '../../types/viewer';
import type { ModelStatus } from '../../scenes/ModelLoader';
import { IconButton } from '../ui/Button';
import { useVisibility } from '../../hooks/useVisibility';
import { useHotspots } from '../../hooks/useHotspots';
import { supportsWebGL } from '../../utils/webgl';
const ProductScene = lazy(() => import('../../scenes/ProductScene'));

export function ProductViewer({
  product,
  compact = false,
  onGallery,
}: {
  product: TacticalProduct;
  compact?: boolean;
  onGallery?: () => void;
}) {
  const root = useRef<HTMLDivElement>(null);
  const visible = useVisibility(root);
  const reducedMotion = Boolean(useReducedMotion());
  const [webgl] = useState(supportsWebGL);
  const [status, setStatus] = useState<ModelStatus>({ state: 'loading', progress: 0 });
  const [command, setCommand] = useState<CameraCommand>({ id: 0 });
  const [preset, setPreset] = useState<CameraPreset>('perspective');
  const [mode, setMode] = useState<InspectionMode>('standard');
  const [fullscreen, setFullscreen] = useState(false);
  const [help, setHelp] = useState(false);
  const [retry, setRetry] = useState(0);
  const hotspots = useHotspots(product.components);
  const fallback = !webgl || !product.model3D || status.state === 'error';
  const selectPreset = (value: CameraPreset) => {
    setPreset(value);
    setCommand((previous) => ({
      id: previous.id + 1,
      position: CAMERA_PRESETS[value],
      target: [0, 0.12, 0],
    }));
  };
  const zoom = (factor: number) =>
    setCommand((previous) => ({ id: previous.id + 1, zoom: factor }));
  const focus = useCallback((point: Vector3Tuple) => {
    const target = point.map((value) => Math.max(-1.2, Math.min(1.2, value))) as Vector3Tuple;
    setCommand((previous) => ({ id: previous.id + 1, target, zoom: 0.78 }));
  }, []);
  useEffect(() => {
    const update = () => setFullscreen(document.fullscreenElement === root.current);
    document.addEventListener('fullscreenchange', update);
    return () => document.removeEventListener('fullscreenchange', update);
  }, []);
  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else if (root.current?.requestFullscreen) await root.current.requestFullscreen();
      else setFullscreen((value) => !value);
    } catch {
      setFullscreen((value) => !value);
    }
  };
  useEffect(() => {
    if (!fullscreen) return;
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setFullscreen(false);
    };
    window.addEventListener('keydown', escape);
    return () => window.removeEventListener('keydown', escape);
  }, [fullscreen]);
  return (
    <div
      ref={root}
      className={`product-viewer ${compact ? 'compact' : ''} ${fullscreen ? 'is-fullscreen' : ''}`}
      data-testid="product-viewer"
      data-model-status={fallback ? 'fallback' : status.state}
    >
      <div className="viewer-top">
        <span className="viewer-badge">
          <span className="status-dot" />
          {fallback ? 'GALERÍA DE PRODUCTO' : 'EXPLORADOR 3D'}
        </span>
        <span className="mono viewer-reference">{product.reference}</span>
      </div>
      <div className="viewer-watermark" aria-hidden="true">
        360<span>°</span>
      </div>
      <div
        className="scene-container"
        tabIndex={fallback ? -1 : 0}
        role="region"
        aria-label="Visor interactivo. Flechas para cambiar de vista, más y menos para zoom, cero para restablecer."
        onKeyDown={(event) => {
          if (event.target !== event.currentTarget) return;
          if (
            ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', '+', '-', '=', '0'].includes(
              event.key,
            )
          )
            event.preventDefault();
          if (event.key === 'ArrowLeft') selectPreset('left');
          if (event.key === 'ArrowRight') selectPreset('right');
          if (event.key === 'ArrowUp') selectPreset('top');
          if (event.key === 'ArrowDown') selectPreset('front');
          if (event.key === '+' || event.key === '=') zoom(0.8);
          if (event.key === '-') zoom(1.25);
          if (event.key === '0') selectPreset('perspective');
        }}
      >
        {fallback ? (
          <div className="viewer-fallback">
            <img src={product.images[0].src} alt={product.images[0].alt} />
            <div className="fallback-message">
              <span>
                {!webgl
                  ? 'Tu dispositivo no dispone de WebGL.'
                  : !product.model3D
                    ? 'Modelo 3D aún no disponible.'
                    : 'No se pudo cargar el modelo 3D.'}
              </span>
              <span>Explora las imágenes del producto.</span>
              {onGallery && (
                <button className="text-link" onClick={onGallery}>
                  Abrir galería →
                </button>
              )}
              {webgl && product.model3D && (
                <button
                  className="text-link"
                  onClick={() => {
                    setStatus({ state: 'loading', progress: 0 });
                    setRetry((value) => value + 1);
                  }}
                >
                  Reintentar carga
                </button>
              )}
            </div>
          </div>
        ) : (
          <Suspense
            fallback={
              <div className="viewer-loading">
                <LoaderCircle className="spinner" size={22} />
                <span>Preparando visor…</span>
              </div>
            }
          >
            <ProductScene
              key={retry}
              product={product}
              command={command}
              visible={visible}
              showHotspots={mode === 'components' && status.state === 'ready'}
              selectedId={hotspots.selected?.id}
              reducedMotion={reducedMotion}
              onSelect={hotspots.select}
              onStatus={setStatus}
              onFocus={focus}
            />
          </Suspense>
        )}
      </div>
      {!fallback && status.state === 'loading' && (
        <div className="loading-status" role="status">
          Cargando modelo {status.progress > 0 ? `${status.progress}%` : '…'}
        </div>
      )}
      {!fallback && (
        <>
          {!compact && (
            <div className="inspection-modes" aria-label="Modo de inspección">
              {(
                [
                  ['standard', 'General'],
                  ['exterior', 'Exterior'],
                  ['components', 'Componentes'],
                  ['detail', 'Detalle'],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  aria-pressed={mode === value}
                  onClick={() => {
                    setMode(value);
                    hotspots.close();
                    selectPreset(value === 'exterior' ? 'front' : 'perspective');
                    if (value === 'detail') setCommand((previous) => ({ ...previous, zoom: 0.65 }));
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
          <div className="viewer-tools">
            <IconButton label="Acercar" onClick={() => zoom(0.8)}>
              <Plus size={18} />
            </IconButton>
            <IconButton label="Alejar" onClick={() => zoom(1.25)}>
              <Minus size={18} />
            </IconButton>
            <span className="tool-divider" />
            <IconButton label="Restablecer cámara" onClick={() => selectPreset('perspective')}>
              <RotateCcw size={17} />
            </IconButton>
            <IconButton
              label={fullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
              onClick={() => void toggleFullscreen()}
            >
              {fullscreen ? <Minimize size={17} /> : <Expand size={17} />}
            </IconButton>
            {!compact && (
              <IconButton
                label="Ayuda del visor"
                aria-expanded={help}
                onClick={() => setHelp((value) => !value)}
              >
                <CircleHelp size={17} />
              </IconButton>
            )}
          </div>
          {help && (
            <div className="viewer-help">
              <strong>Explora a tu manera</strong>
              <p>
                Arrastra para girar. Rueda o pellizca para acercar. Doble clic sobre una pieza para
                enfocarla.
              </p>
              <p>
                Con teclado: flechas para cambiar de vista, + / − para zoom y 0 para restablecer.
              </p>
            </div>
          )}
          {!compact && (
            <div className="camera-presets" aria-label="Vistas de cámara">
              {(Object.keys(PRESET_LABELS) as CameraPreset[])
                .filter((value) => value !== 'interior' || product.model3D?.hasInterior)
                .map((value) => (
                  <button
                    key={value}
                    aria-pressed={preset === value}
                    onClick={() => selectPreset(value)}
                  >
                    {PRESET_LABELS[value]}
                  </button>
                ))}
            </div>
          )}
          {compact && (
            <div className="viewer-hint">
              <MousePointer2 size={14} />
              <span>ARRASTRA PARA EXPLORAR</span>
              <span className="hint-line" />
              <span>360°</span>
            </div>
          )}
          {hotspots.selected && mode === 'components' && (
            <div className="hotspot-panel" role="status">
              <div>
                <span className="eyebrow">COMPONENTE</span>
                <IconButton label="Cerrar componente" onClick={hotspots.close}>
                  <X size={16} />
                </IconButton>
              </div>
              <h3>{hotspots.selected.name}</h3>
              <p>{hotspots.selected.description}</p>
              {hotspots.selected.technicalInfo && <small>{hotspots.selected.technicalInfo}</small>}
            </div>
          )}
          {!compact && mode === 'components' && (
            <div className="component-selector">
              <label htmlFor={`component-${product.id}`}>
                <Scan size={14} /> Inspeccionar
              </label>
              <select
                id={`component-${product.id}`}
                value={hotspots.selected?.id ?? ''}
                onChange={(event) => hotspots.select(event.target.value || null)}
              >
                <option value="">Elige un componente</option>
                {product.components.map((component) => (
                  <option key={component.id} value={component.id}>
                    {component.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </>
      )}
      <span className="model-note">
        <Box size={12} /> {product.illustrative ? 'MODELO ILUSTRATIVO' : 'MODELO DEL PRODUCTO'}
      </span>
    </div>
  );
}
