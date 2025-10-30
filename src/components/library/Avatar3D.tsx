'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Stage, Environment } from '@react-three/drei';
import { Suspense, useMemo, useRef } from 'react';
import * as THREE from 'three';

type Status = 'idle' | 'in_progress' | 'complete';

export default function Avatar3D({ status }: { status: Status }) {
    return (
        <div className="h-[420px] w-full overflow-hidden rounded-2xl border border-white/10 bg-black/40">
            <Canvas camera={{ position: [0, 1.2, 3], fov: 40 }}>
                <color attach="background" args={['#0a0a0a']} />
                <ambientLight intensity={0.35} />
                <directionalLight position={[2, 4, 3]} intensity={1.1} />
                <Suspense fallback={null}>
                    <Stage
                        intensity={0.6}
                        environment={null}
                        adjustCamera={false}
                        shadows={false}
                    >
                        <AthleteSilhouette status={status} />
                    </Stage>
                    <Environment preset="city" />
                </Suspense>
            </Canvas>
        </div>
    );
}

/** Stylized “athlete” placeholder you can later replace with a GLTF model */
function AthleteSilhouette({ status }: { status: Status }) {
    const group = useRef<THREE.Group>(null);

    // simple materials (monochrome “Nike lab” vibe)
    const mat = useMemo(
        () => new THREE.MeshStandardMaterial({ color: '#c6ffe0', metalness: 0.1, roughness: 0.2 }),
        []
    );
    const dark = useMemo(
        () => new THREE.MeshStandardMaterial({ color: '#0fe0a5', metalness: 0.2, roughness: 0.35 }),
        []
    );

    // animation state machine
    useFrame((state) => {
        if (!group.current) return;
        const t = state.clock.getElapsedTime();

        // default subtle breathing
        let y = Math.sin(t * 1.2) * 0.02;
        let rot = Math.sin(t * 0.6) * 0.03;

        if (status === 'in_progress') {
            // “squat” loop: down-up cycle
            const squat = (Math.sin(t * 2.0) + 1) / 2; // 0..1
            y = -0.15 * squat; // dip down
            rot = Math.sin(t * 1.2) * 0.04;
        } else if (status === 'complete') {
            // proud victory: taller, small chest-out tilt
            y = 0.06 + Math.sin(t * 1.0) * 0.01;
            rot = 0.08 + Math.sin(t * 0.8) * 0.01;
        }

        group.current.position.y = y;
        group.current.rotation.y = rot;
        // subtle 3/4 angle
        group.current.rotation.y += 0.35;
    });

    return (
        <group ref={group} position={[0, 0, 0]}>
            {/* Ground */}
            <mesh rotation-x={-Math.PI / 2} position={[0, -0.6, 0]}>
                <circleGeometry args={[2.2, 64]} />
                <meshStandardMaterial color="#0c0c0c" metalness={0.2} roughness={0.9} />
            </mesh>

            {/* Torso */}
            <mesh material={mat} position={[0, 0.3, 0]}>
                <capsuleGeometry args={[0.18, 0.8, 8, 16]} />
            </mesh>

            {/* Head */}
            <mesh material={mat} position={[0, 0.95, 0]}>
                <sphereGeometry args={[0.16, 24, 24]} />
            </mesh>

            {/* Arms */}
            <mesh material={dark} position={[0.33, 0.55, 0]}>
                <capsuleGeometry args={[0.06, 0.36, 6, 12]} />
            </mesh>
            <mesh material={dark} position={[-0.33, 0.55, 0]}>
                <capsuleGeometry args={[0.06, 0.36, 6, 12]} />
            </mesh>

            {/* Legs */}
            <mesh material={dark} position={[0.12, 0.0, 0]}>
                <capsuleGeometry args={[0.08, 0.45, 6, 12]} />
            </mesh>
            <mesh material={dark} position={[-0.12, 0.0, 0]}>
                <capsuleGeometry args={[0.08, 0.45, 6, 12]} />
            </mesh>
        </group>
    );
}
