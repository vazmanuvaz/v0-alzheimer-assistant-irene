'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

/* ─── Schnauzer body built from primitives ─── */
function SchnauzerModel({ state }: { state: 'idle' | 'listening' | 'speaking' }) {
  const groupRef = useRef<THREE.Group>(null!);
  const tailRef = useRef<THREE.Mesh>(null!);
  const jawRef = useRef<THREE.Group>(null!);
  const earLeftRef = useRef<THREE.Mesh>(null!);
  const earRightRef = useRef<THREE.Mesh>(null!);
  const eyeLeftRef = useRef<THREE.Mesh>(null!);
  const eyeRightRef = useRef<THREE.Mesh>(null!);

  const darkGray = useMemo(() => new THREE.Color('#3a3a3a'), []);
  const midGray = useMemo(() => new THREE.Color('#5a5a5a'), []);
  const lightGray = useMemo(() => new THREE.Color('#8a8a8a'), []);
  const beardColor = useMemo(() => new THREE.Color('#c0c0c0'), []);
  const white = useMemo(() => new THREE.Color('#f0f0f0'), []);
  const noseBlack = useMemo(() => new THREE.Color('#111111'), []);
  const eyeColor = useMemo(() => new THREE.Color('#1a1000'), []);
  const tongueColor = useMemo(() => new THREE.Color('#cc6677'), []);

  useFrame((frameState) => {
    const t = frameState.clock.getElapsedTime();

    if (groupRef.current) {
      if (state === 'idle') {
        groupRef.current.rotation.y = Math.sin(t * 0.5) * 0.1;
        groupRef.current.position.y = Math.sin(t * 1.2) * 0.02;
      } else if (state === 'listening') {
        groupRef.current.rotation.y = Math.sin(t * 2) * 0.15;
        groupRef.current.position.y = 0;
      } else {
        groupRef.current.rotation.y = Math.sin(t * 1.5) * 0.05;
        groupRef.current.position.y = Math.sin(t * 3) * 0.01;
      }
    }

    if (tailRef.current) {
      const speed = state === 'speaking' ? 8 : state === 'listening' ? 6 : 3;
      const amplitude = state === 'speaking' ? 0.6 : state === 'listening' ? 0.4 : 0.25;
      tailRef.current.rotation.z = Math.sin(t * speed) * amplitude;
    }

    if (jawRef.current) {
      if (state === 'speaking') {
        jawRef.current.rotation.x = Math.sin(t * 12) * 0.15 + 0.08;
      } else {
        jawRef.current.rotation.x = THREE.MathUtils.lerp(jawRef.current.rotation.x, 0, 0.1);
      }
    }

    if (earLeftRef.current && earRightRef.current) {
      if (state === 'listening') {
        earLeftRef.current.rotation.z = Math.sin(t * 4) * 0.15 + 0.2;
        earRightRef.current.rotation.z = Math.sin(t * 4 + 1) * 0.15 - 0.2;
      } else {
        earLeftRef.current.rotation.z = THREE.MathUtils.lerp(earLeftRef.current.rotation.z, 0.2, 0.05);
        earRightRef.current.rotation.z = THREE.MathUtils.lerp(earRightRef.current.rotation.z, -0.2, 0.05);
      }
    }

    if (eyeLeftRef.current && eyeRightRef.current) {
      const blinkCycle = Math.sin(t * 0.8) > 0.97 ? 0.1 : 1;
      eyeLeftRef.current.scale.y = blinkCycle;
      eyeRightRef.current.scale.y = blinkCycle;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.3, 0]}>
      {/* BODY */}
      <mesh position={[0, 0.4, -0.15]} castShadow>
        <capsuleGeometry args={[0.35, 0.5, 8, 16]} />
        <meshStandardMaterial color={darkGray} roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.35, 0.1]}>
        <sphereGeometry args={[0.28, 16, 16]} />
        <meshStandardMaterial color={midGray} roughness={0.9} />
      </mesh>

      {/* LEGS */}
      {[
        { x: -0.18, z: 0.05 },
        { x: 0.18, z: 0.05 },
        { x: -0.18, z: -0.35 },
        { x: 0.18, z: -0.35 },
      ].map((pos, i) => (
        <group key={i} position={[pos.x, 0.05, pos.z]}>
          <mesh castShadow>
            <capsuleGeometry args={[0.08, 0.35, 6, 12]} />
            <meshStandardMaterial color={darkGray} roughness={0.85} />
          </mesh>
          <mesh position={[0, -0.22, 0]}>
            <sphereGeometry args={[0.09, 12, 12]} />
            <meshStandardMaterial color={white} roughness={0.7} />
          </mesh>
        </group>
      ))}

      {/* NECK */}
      <mesh position={[0, 0.65, 0.1]}>
        <capsuleGeometry args={[0.18, 0.2, 6, 12]} />
        <meshStandardMaterial color={darkGray} roughness={0.85} />
      </mesh>

      {/* HEAD */}
      <group position={[0, 0.85, 0.15]}>
        <mesh castShadow>
          <boxGeometry args={[0.42, 0.35, 0.4]} />
          <meshStandardMaterial color={darkGray} roughness={0.85} />
        </mesh>
        <mesh position={[0, 0.1, 0]}>
          <sphereGeometry args={[0.22, 16, 16]} />
          <meshStandardMaterial color={darkGray} roughness={0.85} />
        </mesh>

        {/* BUSHY EYEBROWS */}
        <mesh position={[-0.1, 0.08, 0.18]} rotation={[0.3, 0, 0.1]}>
          <capsuleGeometry args={[0.055, 0.08, 6, 12]} />
          <meshStandardMaterial color={lightGray} roughness={0.95} />
        </mesh>
        <mesh position={[0.1, 0.08, 0.18]} rotation={[0.3, 0, -0.1]}>
          <capsuleGeometry args={[0.055, 0.08, 6, 12]} />
          <meshStandardMaterial color={lightGray} roughness={0.95} />
        </mesh>

        {/* EYES */}
        <mesh ref={eyeLeftRef} position={[-0.1, 0.0, 0.2]}>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshStandardMaterial color={eyeColor} roughness={0.2} metalness={0.3} />
        </mesh>
        <mesh ref={eyeRightRef} position={[0.1, 0.0, 0.2]}>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshStandardMaterial color={eyeColor} roughness={0.2} metalness={0.3} />
        </mesh>
        {/* Eye highlights */}
        <mesh position={[-0.09, 0.015, 0.235]}>
          <sphereGeometry args={[0.015, 8, 8]} />
          <meshStandardMaterial color="white" emissive="white" emissiveIntensity={0.5} />
        </mesh>
        <mesh position={[0.11, 0.015, 0.235]}>
          <sphereGeometry args={[0.015, 8, 8]} />
          <meshStandardMaterial color="white" emissive="white" emissiveIntensity={0.5} />
        </mesh>

        {/* SNOUT */}
        <mesh position={[0, -0.08, 0.28]}>
          <boxGeometry args={[0.24, 0.16, 0.22]} />
          <meshStandardMaterial color={lightGray} roughness={0.9} />
        </mesh>
        <mesh position={[0, -0.02, 0.3]}>
          <boxGeometry args={[0.2, 0.06, 0.18]} />
          <meshStandardMaterial color={midGray} roughness={0.9} />
        </mesh>

        {/* NOSE */}
        <mesh position={[0, -0.03, 0.4]}>
          <sphereGeometry args={[0.055, 12, 12]} />
          <meshStandardMaterial color={noseBlack} roughness={0.3} metalness={0.1} />
        </mesh>

        {/* BEARD */}
        <mesh position={[0, -0.2, 0.25]}>
          <capsuleGeometry args={[0.12, 0.14, 8, 12]} />
          <meshStandardMaterial color={beardColor} roughness={0.95} />
        </mesh>
        <mesh position={[0, -0.26, 0.22]}>
          <sphereGeometry args={[0.1, 12, 12]} />
          <meshStandardMaterial color={beardColor} roughness={0.95} />
        </mesh>
        <mesh position={[-0.1, -0.15, 0.22]}>
          <sphereGeometry args={[0.07, 10, 10]} />
          <meshStandardMaterial color={beardColor} roughness={0.95} />
        </mesh>
        <mesh position={[0.1, -0.15, 0.22]}>
          <sphereGeometry args={[0.07, 10, 10]} />
          <meshStandardMaterial color={beardColor} roughness={0.95} />
        </mesh>

        {/* JAW */}
        <group ref={jawRef} position={[0, -0.13, 0.28]}>
          <mesh>
            <boxGeometry args={[0.18, 0.04, 0.15]} />
            <meshStandardMaterial color={midGray} roughness={0.8} />
          </mesh>
          {state === 'speaking' && (
            <mesh position={[0, -0.02, 0.05]}>
              <sphereGeometry args={[0.04, 8, 8]} />
              <meshStandardMaterial color={tongueColor} roughness={0.6} />
            </mesh>
          )}
        </group>

        {/* EARS */}
        <mesh ref={earLeftRef} position={[-0.22, 0.12, -0.02]} rotation={[0, 0, 0.2]}>
          <capsuleGeometry args={[0.06, 0.15, 6, 12]} />
          <meshStandardMaterial color={darkGray} roughness={0.9} side={THREE.DoubleSide} />
        </mesh>
        <mesh ref={earRightRef} position={[0.22, 0.12, -0.02]} rotation={[0, 0, -0.2]}>
          <capsuleGeometry args={[0.06, 0.15, 6, 12]} />
          <meshStandardMaterial color={darkGray} roughness={0.9} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* TAIL */}
      <mesh ref={tailRef} position={[0, 0.65, -0.5]} rotation={[0.5, 0, 0]}>
        <capsuleGeometry args={[0.04, 0.18, 6, 12]} />
        <meshStandardMaterial color={darkGray} roughness={0.85} />
      </mesh>
    </group>
  );
}

/* ─── Exported 3D Scene ─── */
export default function Schnauzer3DScene({ state }: { state: 'idle' | 'listening' | 'speaking' }) {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Canvas
        camera={{ position: [0, 0.7, 2.2], fov: 35 }}
        shadows
        gl={{ antialias: true, alpha: true }}
        style={{ width: '100%', height: '100%' }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight
          position={[3, 5, 4]}
          intensity={1.2}
          castShadow
        />
        <directionalLight position={[-2, 3, -1]} intensity={0.4} />
        <pointLight position={[0, 2, 3]} intensity={0.3} color="#ffeedd" />

        <Environment preset="studio" />

        <Float
          speed={state === 'idle' ? 1.5 : state === 'listening' ? 3 : 2}
          rotationIntensity={state === 'listening' ? 0.3 : 0.1}
          floatIntensity={state === 'idle' ? 0.3 : 0.1}
        >
          <SchnauzerModel state={state} />
        </Float>

        <ContactShadows
          position={[0, -0.15, 0]}
          opacity={0.4}
          scale={3}
          blur={2}
          far={2}
        />
      </Canvas>
    </div>
  );
}
