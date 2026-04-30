'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function LiquidBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // --- TouchTexture Class (Enhanced) ---
    class TouchTexture {
      size: number; width: number; height: number; maxAge: number; radius: number;
      speed: number; trail: any[]; last: any; canvas: HTMLCanvasElement | null;
      ctx: CanvasRenderingContext2D | null; texture: THREE.Texture | null;

      constructor() {
        this.size = 64; this.width = this.height = this.size; this.maxAge = 64;
        this.radius = 0.25 * this.size; this.speed = 1 / this.maxAge;
        this.trail = []; this.last = null; this.canvas = null; this.ctx = null; this.texture = null;
        this.initTexture();
      }

      initTexture() {
        this.canvas = document.createElement("canvas");
        this.canvas.width = this.width; this.canvas.height = this.height;
        this.ctx = this.canvas.getContext("2d");
        if (this.ctx) {
          this.ctx.fillStyle = "black";
          this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }
        this.texture = new THREE.Texture(this.canvas);
      }

      update() {
        this.clear();
        for (let i = this.trail.length - 1; i >= 0; i--) {
          const point = this.trail[i];
          let f = point.force * this.speed * (1 - point.age / this.maxAge);
          point.x += point.vx * f; point.y += point.vy * f; point.age++;
          if (point.age > this.maxAge) { this.trail.splice(i, 1); } 
          else { this.drawPoint(point); }
        }
        if (this.texture) this.texture.needsUpdate = true;
      }

      clear() {
        if (this.ctx) { this.ctx.fillStyle = "black"; this.ctx.fillRect(0, 0, this.canvas!.width, this.canvas!.height); }
      }

      addTouch(point: any) {
        let force = 0; let vx = 0; let vy = 0;
        if (this.last) {
          const dx = point.x - this.last.x; const dy = point.y - this.last.y;
          if (dx === 0 && dy === 0) return;
          const dd = dx * dx + dy * dy; let d = Math.sqrt(dd);
          vx = dx / d; vy = dy / d; force = Math.min(dd * 20000, 2.0);
        }
        this.last = { x: point.x, y: point.y };
        this.trail.push({ x: point.x, y: point.y, age: 0, force, vx, vy });
      }

      drawPoint(point: any) {
        if (!this.ctx) return;
        const pos = { x: point.x * this.width, y: (1 - point.y) * this.height };
        let intensity = point.age < this.maxAge * 0.3 
          ? Math.sin((point.age / (this.maxAge * 0.3)) * (Math.PI / 2))
          : - (1 - (point.age - this.maxAge * 0.3) / (this.maxAge * 0.7)) * ((1 - (point.age - this.maxAge * 0.3) / (this.maxAge * 0.7)) - 2);
        intensity *= point.force;
        let color = `${((point.vx + 1) / 2) * 255}, ${((point.vy + 1) / 2) * 255}, ${intensity * 255}`;
        this.ctx.shadowOffsetX = this.ctx.shadowOffsetY = this.size * 5;
        this.ctx.shadowBlur = this.radius;
        this.ctx.shadowColor = `rgba(${color},${0.2 * intensity})`;
        this.ctx.beginPath();
        this.ctx.fillStyle = "rgba(255,0,0,1)";
        this.ctx.arc(pos.x - this.size * 5, pos.y - this.size * 5, this.radius, 0, Math.PI * 2);
        this.ctx.fill();
      }
    }

    // --- Complex Shader ---
    const vertexShader = `
      varying vec2 vUv;
      void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
    `;

    const fragmentShader = `
      uniform float uTime;
      uniform vec2 uResolution;
      uniform vec3 uColor1, uColor2, uColor3, uColor4, uColor5, uColor6;
      uniform float uSpeed, uIntensity, uGrainIntensity, uGradientSize, uGradientCount;
      uniform float uColor1Weight, uColor2Weight;
      uniform vec3 uDarkNavy;
      uniform sampler2D uTouchTexture;
      varying vec2 vUv;

      float grain(vec2 uv, float time) {
        vec2 grainUv = uv * uResolution * 0.5;
        return fract(sin(dot(grainUv + time, vec2(12.9898, 78.233))) * 43758.5453) * 2.0 - 1.0;
      }

      vec3 getGradientColor(vec2 uv, float time) {
        float gradRad = uGradientSize;
        
        // 12 Animated Centers
        vec2 c[12];
        c[0] = vec2(0.5 + sin(time * uSpeed * 0.4) * 0.4, 0.5 + cos(time * uSpeed * 0.5) * 0.4);
        c[1] = vec2(0.5 + cos(time * uSpeed * 0.6) * 0.5, 0.5 + sin(time * uSpeed * 0.45) * 0.5);
        c[2] = vec2(0.5 + sin(time * uSpeed * 0.35) * 0.45, 0.5 + cos(time * uSpeed * 0.55) * 0.45);
        c[3] = vec2(0.5 + cos(time * uSpeed * 0.5) * 0.4, 0.5 + sin(time * uSpeed * 0.4) * 0.4);
        c[4] = vec2(0.5 + sin(time * uSpeed * 0.7) * 0.35, 0.5 + cos(time * uSpeed * 0.6) * 0.35);
        c[5] = vec2(0.5 + cos(time * uSpeed * 0.45) * 0.5, 0.5 + sin(time * uSpeed * 0.65) * 0.5);
        c[6] = vec2(0.5 + sin(time * uSpeed * 0.55) * 0.38, 0.5 + cos(time * uSpeed * 0.48) * 0.42);
        c[7] = vec2(0.5 + cos(time * uSpeed * 0.65) * 0.36, 0.5 + sin(time * uSpeed * 0.52) * 0.44);
        c[8] = vec2(0.5 + sin(time * uSpeed * 0.42) * 0.41, 0.5 + cos(time * uSpeed * 0.58) * 0.39);
        c[9] = vec2(0.5 + cos(time * uSpeed * 0.48) * 0.37, 0.5 + sin(time * uSpeed * 0.62) * 0.43);
        c[10] = vec2(0.5 + sin(time * uSpeed * 0.68) * 0.33, 0.5 + cos(time * uSpeed * 0.44) * 0.46);
        c[11] = vec2(0.5 + cos(time * uSpeed * 0.38) * 0.39, 0.5 + sin(time * uSpeed * 0.56) * 0.41);

        float dists[12];
        for(int i=0; i<12; i++) dists[i] = 1.0 - smoothstep(0.0, gradRad, length(uv - c[i]));

        vec3 finalColor = vec3(0.0);
        float totalWeight = 0.0;
        for(int i=0; i<6; i++) {
          float dist = length(uv - c[i]);
          float influence = 1.0 - smoothstep(0.0, gradRad, dist);
          float pulse = (0.55 + 0.45 * sin(time * uSpeed + float(i)));
          
          // Cycle between Deep Green, Silver, and Light Green
          int colorIndex = int(mod(float(i), 3.0));
          vec3 activeColor = uColor1; // Deep Green
          float weight = uColor1Weight;
          
          if (colorIndex == 1) {
            activeColor = uColor2; // Silver
            weight = uColor2Weight;
          } else if (colorIndex == 2) {
            activeColor = uColor3; // Light Green
            weight = 1.0;
          }
          
          finalColor += activeColor * influence * pulse * weight;
          totalWeight += influence * pulse;
        }
        
        if (totalWeight > 0.1) finalColor /= totalWeight;

        finalColor = finalColor * uIntensity;
        float lum = dot(finalColor, vec3(0.299, 0.587, 0.114));
        finalColor = mix(vec3(lum), finalColor, 1.2); // Balanced saturation
        finalColor = pow(finalColor, vec3(1.1));
        return mix(uDarkNavy, finalColor, max(length(finalColor), 0.1));
      }

      void main() {
        vec2 uv = vUv;
        vec4 touchTex = texture2D(uTouchTexture, uv);
        vec3 color = getGradientColor(uv, uTime);
        color += grain(uv, uTime) * uGrainIntensity;
        gl_FragColor = vec4(clamp(color, 0.0, 0.75), 1.0); // Clamp at 0.75 to ensure darkness
      }
    `;

    // --- Init ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 50;
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    const touchTexture = new TouchTexture();
    const uniforms = {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      uColor1: { value: new THREE.Vector3(0.0, 0.2, 0.1) }, // Deep Forest Green
      uColor2: { value: new THREE.Vector3(0.7, 0.7, 0.8) }, // Metallic Silver
      uColor3: { value: new THREE.Vector3(0.3, 0.6, 0.3) }, // Soft Light Green
      uColor4: { value: new THREE.Vector3(0.1, 0.3, 0.2) }, 
      uColor5: { value: new THREE.Vector3(0.6, 0.8, 0.6) }, 
      uColor6: { value: new THREE.Vector3(0.05, 0.1, 0.05) },
      uSpeed: { value: 0.3 }, 
      uIntensity: { value: 1.4 }, 
      uGradientSize: { value: 1.0 }, 
      uGradientCount: { value: 6.0 },
      uColor1Weight: { value: 1.0 },
      uColor2Weight: { value: 0.8 },
      uDarkNavy: { value: new THREE.Vector3(0.01, 0.02, 0.01) }, // Very dark forest base
      uGrainIntensity: { value: 0.03 },
      uTouchTexture: { value: touchTexture.texture }
    };

    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), new THREE.ShaderMaterial({ uniforms, vertexShader, fragmentShader }));
    scene.add(mesh);

    const clock = new THREE.Clock();
    const animate = () => {
      uniforms.uTime.value += clock.getDelta();
      touchTexture.update();
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    const handleMouseMove = (e: MouseEvent) => touchTexture.addTouch({ x: e.clientX / window.innerWidth, y: 1 - e.clientY / window.innerHeight });
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight; camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('mousemove', handleMouseMove); window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove); window.removeEventListener('resize', handleResize);
      renderer.dispose(); if (containerRef.current) containerRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={containerRef} className="fixed inset-0 -z-1 pointer-events-none" />;
}
