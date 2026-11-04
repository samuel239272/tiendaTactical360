import { Environment, Lightformer, ContactShadows } from '@react-three/drei';
export function Lighting() {
  return (
    <>
      <ambientLight intensity={0.65} />
      <directionalLight position={[3, 6, 5]} intensity={3.2} color="#fff4de" />
      <directionalLight position={[-4, 3, -3]} intensity={2} color="#d8e6df" />
      <directionalLight position={[2, 0, -5]} intensity={0.7} />
      <Environment resolution={64} frames={1}>
        <Lightformer
          form="rect"
          intensity={2.2}
          position={[0, 5, 0]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={[10, 10, 1]}
        />
        <Lightformer
          form="rect"
          intensity={1.5}
          position={[-4, 2, 0]}
          rotation={[0, Math.PI / 2, 0]}
          scale={[3, 5, 1]}
        />
      </Environment>
      <ContactShadows
        position={[0, -1.08, 0]}
        opacity={0.48}
        scale={9}
        blur={2.8}
        far={4}
        resolution={256}
        frames={1}
      />
    </>
  );
}
