'use client';

import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';
import * as THREE from 'three';
import type { HandResults, HandsInstance, CameraInstance } from '@/types/mediapipe';

// Helper to draw text to canvas and get pixel coordinates
function getTextCoordinates(text: string, font: string = '350px "Noto Sans Sinhala", sans-serif'): THREE.Vector3[] {
  const canvas = document.createElement('canvas');
  const size = 2048; // Increased texture size for larger text
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return [];

  ctx.font = font;
  ctx.fillStyle = 'white';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, size / 2, size / 2);

  const imageData = ctx.getImageData(0, 0, size, size);
  const data = imageData.data;
  const coords: THREE.Vector3[] = [];
  
  // Sample pixels - step size to control density
  // Increased step to avoid exceeding particle count with larger text area
  const step = 8; 
  for (let y = 0; y < size; y += step) {
    for (let x = 0; x < size; x += step) {
      if (data[(y * size + x) * 4] > 128) { // If pixel is non-black
        // Map to 3D space centered at origin
        // x: -50 to 50, y: -50 to 50
        coords.push(new THREE.Vector3(
          (x - size / 2) * 0.12,  // Slightly reduced scale factor to keep it within view
          -(y - size / 2) * 0.12, // Invert Y for 3D
          0
        ));
      }
    }
  }
  return coords;
}

// Helper to generate sphere coordinates
function getSphereCoordinates(count: number, radius: number): THREE.Vector3[] {
    const coords: THREE.Vector3[] = [];
    for (let i = 0; i < count; i++) {
        const phi = Math.acos(-1 + (2 * i) / count);
        const theta = Math.sqrt(count * Math.PI) * phi;
        coords.push(new THREE.Vector3(
            radius * Math.cos(theta) * Math.sin(phi),
            radius * Math.sin(theta) * Math.sin(phi),
            radius * Math.cos(phi)
        ));
    }
    return coords;
}

// Helper to generate scatter coordinates (Blast effect)
function getScatterCoordinates(count: number): THREE.Vector3[] {
    const coords: THREE.Vector3[] = [];
    for (let i = 0; i < count; i++) {
        // Random scatter in a large volume
        coords.push(new THREE.Vector3(
            (Math.random() - 0.5) * 300,
            (Math.random() - 0.5) * 300,
            (Math.random() - 0.5) * 300
        ));
    }
    return coords;
}

export default function ParticleHandTracker() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [scriptsLoaded, setScriptsLoaded] = useState({ hands: false, camera: false });
  const [status, setStatus] = useState('Initializing...');
  const [currentShape, setCurrentShape] = useState('sphere');
  const currentShapeRef = useRef('sphere');
  
  useEffect(() => {
    if (!scriptsLoaded.hands || !scriptsLoaded.camera || !containerRef.current || !videoRef.current) return;

    if (!window.Hands || !window.Camera) return;

    setStatus('Starting Three.js...');

    // --- THREE.JS SETUP ---
    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let geometry: THREE.BufferGeometry;
    let material: THREE.PointsMaterial;
    let starGeo: THREE.BufferGeometry;
    let starMat: THREE.PointsMaterial;

    try {
      scene = new THREE.Scene();

      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.z = 100;

      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setClearColor(0x000000, 0);
      renderer.domElement.className = 'absolute top-0 left-0 w-full h-full pointer-events-none z-40';

      if (!containerRef.current) throw new Error('Container ref is null');
      containerRef.current.appendChild(renderer.domElement);
    } catch (error) {
      console.error('Failed to initialize Three.js:', error);
      setStatus('Error: Failed to initialize 3D graphics');
      return;
    }

    // --- PARTICLE SYSTEM ---
    const particleCount = 10000;
    geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 200;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 200;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 200;
        colors[i * 3] = 0; // r
        colors[i * 3 + 1] = 1; // g
        colors[i * 3 + 2] = 1; // b
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    material = new THREE.PointsMaterial({
      size: 1.2,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true,
      opacity: 0.9,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // --- BACKGROUND STARFIELD ---
    const starCount = 2000;
    starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    for(let i=0; i<starCount; i++) {
        starPos[i*3] = (Math.random() - 0.5) * 400;
        starPos[i*3+1] = (Math.random() - 0.5) * 400;
        starPos[i*3+2] = (Math.random() - 0.5) * 400;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    starMat = new THREE.PointsMaterial({
        size: 0.5,
        color: 0xffffff,
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending
    });
    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    let targetPositions: THREE.Vector3[] = [];
    let targetColors: THREE.Color[] = []; // Target colors array
    
    // Moved currentShape to React state to allow UI access
    
    const shapes: Record<string, THREE.Vector3[]> = {
        'sphere': getSphereCoordinates(particleCount, 30),
        'hello': getTextCoordinates('Hello'),
        'gemini': getTextCoordinates('Gemini'),
        'sinhala-great': getTextCoordinates('නියමයි'),
        'sinhala-hello': getTextCoordinates('ආයුබෝවන්'),
        'scatter': getScatterCoordinates(particleCount)
    };

    // Color mapping for each shape
    const shapeColors: Record<string, THREE.Color> = {
        'sphere': new THREE.Color(1, 0.6, 0),    // Orange/Gold
        'hello': new THREE.Color(0, 1, 1),       // Cyan
        'gemini': new THREE.Color(1, 0, 1),      // Magenta
        'sinhala-great': new THREE.Color(0, 1, 0.5), // Greenish
        'sinhala-hello': new THREE.Color(0.5, 0, 1), // Purple
        'scatter': new THREE.Color(1, 0.2, 0.2), // Red/Fire
    };

    const setTargetShape = (shapeKey: string) => {
        if (currentShapeRef.current === shapeKey) return;
        currentShapeRef.current = shapeKey;
        setCurrentShape(shapeKey); // Update state for UI

        let newTargets: THREE.Vector3[] = shapes[shapeKey] || shapes['sphere'];
        const newColor = shapeColors[shapeKey] || new THREE.Color(1, 1, 1);
        
        // Regenerate scatter every time to make it dynamic? 
        if (shapeKey === 'scatter') {
             newTargets = getScatterCoordinates(particleCount);
        }

        targetPositions = [];
        targetColors = []; // Reset target colors

        for(let i=0; i<particleCount; i++) {
            targetPositions.push(newTargets[i % newTargets.length]);
            targetColors.push(newColor);
        }
    };
    
    setTargetShape('sphere');

    // --- MEDIAPIPE SETUP ---
    const onResults = (results: HandResults): void => {
        if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
           return;
        }

        const landmarks = results.multiHandLandmarks[0];
        
        const isFingerUp = (tipIdx: number, pipIdx: number) => {
             return landmarks[tipIdx].y < landmarks[pipIdx].y;
        };

        const indexUp = isFingerUp(8, 6);
        const middleUp = isFingerUp(12, 10);
        const ringUp = isFingerUp(16, 14);
        const pinkyUp = isFingerUp(20, 18);
        
        // Thumb is tricky. Simple check: Tip x is further out than IP x (depending on hand side). 
        // For simplicity, let's assume right hand or just check tip vs mcp distance?
        // Let's use a simpler heuristic: Thumb tip is "above" (lower y) than index MCP if hand is upright?
        // Or better: Thumbs Up usually means Thumb Up, other fingers folded.
        // So: Index, Middle, Ring, Pinky DOWN. Thumb UP.
        
        // Thumb Up check (Relative to Index MCP Y):
        // Thumb tip should be higher (lower Y) than Index MCP
        const thumbTipY = landmarks[4].y;
        const indexMcpY = landmarks[5].y;
        const thumbUp = thumbTipY < indexMcpY; 

        let fingersUpCount = 0;
        if (indexUp) fingersUpCount++;
        if (middleUp) fingersUpCount++;
        if (ringUp) fingersUpCount++;
        if (pinkyUp) fingersUpCount++;

        // 1. Thumbs Up -> Blast/Scatter
        // Strict check: Thumb Up + Others Down
        if (thumbUp && fingersUpCount === 0) {
            setTargetShape('scatter');
            setStatus('Gesture: BLAST!');
        }
        else if (indexUp && !middleUp && !ringUp && !pinkyUp) {
            setTargetShape('hello');
            setStatus('Gesture: Hello');
        }
        else if (indexUp && middleUp && !ringUp && !pinkyUp) {
            setTargetShape('gemini');
            setStatus('Gesture: Gemini');
        }
        else if (indexUp && middleUp && ringUp && !pinkyUp) {
            setTargetShape('sinhala-great');
            setStatus('Gesture: නියමයි (Great)');
        }
        else if (fingersUpCount >= 4) {
            setTargetShape('sphere');
            setStatus('Gesture: Open Palm');
        }
        else if (fingersUpCount === 0) {
            setTargetShape('sinhala-hello');
             setStatus('Gesture: ආයුබෝවන් (Ayubowan)');
        }

        if (currentShapeRef.current === 'sphere') {
             const handX = landmarks[9].x; 
             particles.rotation.y = (handX - 0.5) * 4;
             particles.rotation.x = (landmarks[9].y - 0.5) * 4;
        } else if (currentShapeRef.current === 'scatter') {
             particles.rotation.y += 0.02; // Rotate blast
             particles.rotation.x += 0.02;
        } else {
             particles.rotation.y = THREE.MathUtils.lerp(particles.rotation.y, 0, 0.05);
             particles.rotation.x = THREE.MathUtils.lerp(particles.rotation.x, 0, 0.05);
        }
    };

    // --- MEDIAPIPE INITIALIZATION ---
    let hands: HandsInstance | undefined;
    let mpCamera: CameraInstance | undefined;

    try {
      hands = new window.Hands({locateFile: (file: string) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
      }});

      hands.setOptions({
          maxNumHands: 1,
          modelComplexity: 1,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5
      });

      hands.onResults(onResults);
    } catch (error) {
      console.error('Failed to initialize MediaPipe Hands:', error);
      setStatus('Error: Failed to initialize hand tracking');
      return;
    }

    if (videoRef.current) {
        try {
          mpCamera = new window.Camera(videoRef.current, {
              onFrame: async () => {
                  if (videoRef.current) {
                      await hands.send({image: videoRef.current});
                  }
              },
              width: 1280,
              height: 720
          });
          mpCamera.start();
          setStatus('Camera Active. Detecting Hands...');
        } catch (error) {
          console.error('Failed to initialize camera:', error);
          setStatus('Error: Failed to start camera');
          return;
        }
    }

    // --- ANIMATION ---
    const positionsArray = geometry.attributes.position.array as Float32Array;
    const colorsArray = geometry.attributes.color.array as Float32Array;
    let animationId: number;
    
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      
      if (targetPositions.length > 0) {
          // Adjust speed based on shape? Scatter should be fast?
          const lerpFactor = currentShapeRef.current === 'scatter' ? 0.1 : 0.05;
          const colorLerpFactor = 0.05; // Smooth color transition

          for (let i = 0; i < particleCount; i++) {
              const tx = targetPositions[i].x;
              const ty = targetPositions[i].y;
              const tz = targetPositions[i].z;

              const idx = i * 3;
              positionsArray[idx] += (tx - positionsArray[idx]) * lerpFactor;
              positionsArray[idx+1] += (ty - positionsArray[idx+1]) * lerpFactor;
              positionsArray[idx+2] += (tz - positionsArray[idx+2]) * lerpFactor;

              // Color Lerp
              if (targetColors.length > 0) {
                  const targetColor = targetColors[i];
                  colorsArray[idx] += (targetColor.r - colorsArray[idx]) * colorLerpFactor;
                  colorsArray[idx+1] += (targetColor.g - colorsArray[idx+1]) * colorLerpFactor;
                  colorsArray[idx+2] += (targetColor.b - colorsArray[idx+2]) * colorLerpFactor;
              }
          }
          geometry.attributes.position.needsUpdate = true;
          geometry.attributes.color.needsUpdate = true;
      }
      
      renderer.render(scene, camera);
      
      // Rotate starfield slowly
      starField.rotation.y += 0.0005;
      starField.rotation.x += 0.0002;
    };

    animate();

    const handleResize = () => {
        if (!containerRef.current) return;
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
        // Cleanup event listeners
        window.removeEventListener('resize', handleResize);

        // Stop animation loop
        cancelAnimationFrame(animationId);

        // Close MediaPipe Hands and stop camera
        try {
          if (hands) {
            hands.close();
          }
          if (mpCamera) {
            mpCamera.stop();
          }
        } catch (error) {
          console.error('Error closing MediaPipe resources:', error);
        }

        // Dispose Three.js resources
        try {
          if (geometry) {
            geometry.dispose();
          }
          if (material) {
            material.dispose();
          }
          if (starGeo) {
            starGeo.dispose();
          }
          if (starMat) {
            starMat.dispose();
          }
          if (renderer) {
            renderer.dispose();
            if (containerRef.current && renderer.domElement) {
              containerRef.current.removeChild(renderer.domElement);
            }
          }
        } catch (error) {
          console.error('Error disposing Three.js resources:', error);
        }
    };
  }, [scriptsLoaded]);

  return (
    <>
        <Script 
            src="https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js" 
            onLoad={() => setScriptsLoaded(prev => ({ ...prev, camera: true }))}
        />
        <Script 
            src="https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js" 
            onLoad={() => setScriptsLoaded(prev => ({ ...prev, hands: true }))}
        />
        <div className="relative w-full h-screen overflow-hidden" ref={containerRef}>
            {/* Background Camera */}
            <video 
                ref={videoRef} 
                className="absolute top-0 left-0 w-full h-full object-cover transform scale-x-[-1] z-10" // Mirror effect, Z-index 10
                playsInline
                muted
            />
            {/* Dark Overlay for Particles Contrast */}
            <div className="absolute top-0 left-0 w-full h-full bg-black/40 pointer-events-none z-20" />

            {/* Top Left: System Status */}
            <div className="absolute top-10 left-10 font-mono text-cyan-400 select-none z-50">
                <div className="border-l-2 border-cyan-400 pl-2">
                    <div className="text-xs text-cyan-400/70">SYSTEM STATUS</div>
                    <div className="text-2xl font-bold tracking-wider">ONLINE</div>
                </div>
                <div className="mt-4 border-l-2 border-cyan-400 pl-2">
                     <div className="text-xs text-cyan-400/70">PARTICLES</div>
                     <div className="text-xl font-bold">10,000 UNITS</div>
                     <div className="text-xs text-cyan-400/50 mt-1">FPS: 60 | SECTOR 7</div>
                </div>
            </div>

            {/* Bottom Left: Command Info */}
            <div className="absolute bottom-10 left-10 font-mono select-none z-50">
                 <div className="border-l-2 border-cyan-400 pl-2">
                    <div className="text-xs text-cyan-400/70">LEFT HAND [COMMAND]</div>
                    <div className="flex items-center gap-2">
                        <span className="text-pink-500 font-bold">CMD:</span>
                        <span className="text-xl text-white font-bold tracking-widest uppercase">{status.replace('Gesture: ', '') || 'STANDBY'}</span>
                    </div>
                    <div className="text-xs text-cyan-400/50">GESTURE CONTROL</div>
                 </div>
            </div>

            {/* Bottom Right: Physics Info */}
            <div className="absolute bottom-10 right-10 font-mono text-right select-none z-50">
                 <div className="border-r-2 border-pink-500 pr-2">
                    <div className="text-xs text-pink-500/70">RIGHT HAND [PHYSICS]</div>
                    <div className="flex flex-col items-end">
                        <div className="flex items-center gap-2">
                            <span className="text-cyan-400 font-bold">MODE:</span>
                            <span className="text-xl text-white font-bold tracking-widest uppercase">{currentShape === 'scatter' ? 'SCATTER' : 'MORPH'}</span>
                        </div>
                        <div className="text-xs text-pink-500/50">MIRROR FIELD</div>
                    </div>
                 </div>
            </div>

            {/* Center: Reticle / Graphical Overlay */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] pointer-events-none opacity-20 border border-cyan-500/30 rounded-full blur-sm"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] pointer-events-none opacity-10 border-x border-cyan-500/20 skew-x-12"></div>
        </div>
    </>
  );
}
