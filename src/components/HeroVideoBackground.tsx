import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Brain, Cpu, Sparkles, Activity, Code2, Network, Zap, Atom } from 'lucide-react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  layer: number;
}

interface SynapticPulse {
  fromNode: { x: number; y: number };
  toNode: { x: number; y: number };
  progress: number;
  speed: number;
  color: string;
}

export const HeroVideoBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({ x: -1000, y: -1000, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 850);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || 850;
      initNeuralLayers();
    };

    window.addEventListener('resize', handleResize);

    // ─────────────────────────────────────────────────────────────
    // 1. Multi-Layer Neural Network Setup (Deep Learning Model)
    // ─────────────────────────────────────────────────────────────
    let neuralNodes: Array<{ x: number; y: number; layer: number; index: number; pulsePhase: number }> = [];
    let synapticPulses: SynapticPulse[] = [];

    const initNeuralLayers = () => {
      neuralNodes = [];
      synapticPulses = [];

      // Define 5 neural layers across the canvas width
      const layerConfig = [
        { count: 5, xRatio: 0.12 }, // Input Layer (e.g. Raw Features, Embeddings)
        { count: 7, xRatio: 0.32 }, // Hidden Layer 1 (Conv/Dense Weights)
        { count: 8, xRatio: 0.52 }, // Hidden Layer 2 (Multi-Head Attention / Latent Space)
        { count: 6, xRatio: 0.72 }, // Hidden Layer 3 (Feature Aggregation)
        { count: 4, xRatio: 0.90 }, // Output Layer (Predictions / Policy Head)
      ];

      layerConfig.forEach((layer, layerIdx) => {
        const spacingY = (height * 0.75) / (layer.count + 1);
        const startY = height * 0.12;

        for (let i = 0; i < layer.count; i++) {
          neuralNodes.push({
            x: width * layer.xRatio,
            y: startY + spacingY * (i + 1),
            layer: layerIdx,
            index: i,
            pulsePhase: Math.random() * Math.PI * 2,
          });
        }
      });
    };

    initNeuralLayers();

    // ─────────────────────────────────────────────────────────────
    // 2. Dynamic Research Particle Swarm (Background Nodes)
    // ─────────────────────────────────────────────────────────────
    const particles: Particle[] = [];
    const numParticles = 45;

    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1,
        alpha: Math.random() * 0.4 + 0.15,
        layer: Math.floor(Math.random() * 3),
      });
    }

    // Spawn synaptic data packet pulses periodically
    const spawnPulse = () => {
      if (neuralNodes.length === 0) return;
      // pick a random node in layers 0..3
      const sourceNodes = neuralNodes.filter(n => n.layer < 4);
      if (sourceNodes.length === 0) return;

      const from = sourceNodes[Math.floor(Math.random() * sourceNodes.length)];
      const targets = neuralNodes.filter(n => n.layer === from.layer + 1);
      if (targets.length === 0) return;

      const to = targets[Math.floor(Math.random() * targets.length)];
      const colors = ['#38bdf8', '#818cf8', '#06b6d4', '#f59e0b', '#34d399'];

      synapticPulses.push({
        fromNode: { x: from.x, y: from.y },
        toNode: { x: to.x, y: to.y },
        progress: 0,
        speed: 0.015 + Math.random() * 0.02,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    };

    let pulseTimer = 0;

    // Mouse interactive handlers
    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
      };
    };

    const onMouseLeave = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseleave', onMouseLeave);

    // ─────────────────────────────────────────────────────────────
    // 3. Main High-Performance Animation Render Loop
    // ─────────────────────────────────────────────────────────────
    let time = 0;

    const render = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, width, height);
      time += 0.02;

      pulseTimer++;
      if (pulseTimer % 12 === 0) {
        spawnPulse();
      }

      // A. Draw Perspective Mathematical Matrix Grid on Floor
      const gridStartY = height * 0.65;
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.04)';
      ctx.lineWidth = 1;

      // Horizontal grid lines with perspective compression
      for (let y = gridStartY; y < height; y += 22) {
        const factor = (y - gridStartY) / (height - gridStartY);
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.strokeStyle = `rgba(56, 189, 248, ${0.02 + factor * 0.06})`;
        ctx.stroke();
      }

      // Vertical perspective vanishing lines
      const centerX = width * 0.5;
      for (let x = -width * 0.5; x < width * 1.5; x += 90) {
        ctx.beginPath();
        ctx.moveTo(centerX + (x - centerX) * 0.2, gridStartY);
        ctx.lineTo(x, height);
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.035)';
        ctx.stroke();
      }

      // B. Draw Background Research Particle Swarm & Connections
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];

        p1.x += p1.vx;
        p1.y += p1.vy;

        if (p1.x < 0) p1.x = width;
        if (p1.x > width) p1.x = 0;
        if (p1.y < 0) p1.y = height;
        if (p1.y > height) p1.y = 0;

        // Subtle mouse interaction
        if (mouseRef.current.active) {
          const mdx = mouseRef.current.x - p1.x;
          const mdy = mouseRef.current.y - p1.y;
          const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (mdist < 140) {
            p1.x -= (mdx / mdist) * 0.8;
            p1.y -= (mdy / mdist) * 0.8;
          }
        }

        // Draw particle dot
        ctx.fillStyle = `rgba(255, 255, 255, ${p1.alpha})`;
        ctx.beginPath();
        ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
        ctx.fill();

        // Connect nearby swarm particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 100) {
            const alpha = (1 - dist / 100) * 0.14;
            ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
            ctx.lineWidth = 0.7;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      // C. Draw Deep Learning Neural Synapses (Inter-Layer Connections)
      for (let i = 0; i < neuralNodes.length; i++) {
        const nodeA = neuralNodes[i];

        // Connect only to the next layer
        const nextLayerNodes = neuralNodes.filter(n => n.layer === nodeA.layer + 1);

        nextLayerNodes.forEach(nodeB => {
          // Sine wave opacity modulation for synaptic activity
          const synAlpha = 0.08 + Math.sin(time + nodeA.index * 0.5 + nodeB.index * 0.3) * 0.04;

          ctx.strokeStyle = `rgba(56, 189, 248, ${Math.max(0.02, synAlpha)})`;
          ctx.lineWidth = 0.9;
          ctx.beginPath();
          ctx.moveTo(nodeA.x, nodeA.y);
          ctx.lineTo(nodeB.x, nodeB.y);
          ctx.stroke();
        });
      }

      // D. Draw Traveling Synaptic Pulses (Data Flow / Activation Packets)
      for (let i = synapticPulses.length - 1; i >= 0; i--) {
        const pulse = synapticPulses[i];
        pulse.progress += pulse.speed;

        if (pulse.progress >= 1) {
          synapticPulses.splice(i, 1);
          continue;
        }

        const currentX = pulse.fromNode.x + (pulse.toNode.x - pulse.fromNode.x) * pulse.progress;
        const currentY = pulse.fromNode.y + (pulse.toNode.y - pulse.fromNode.y) * pulse.progress;

        // Glowing pulse head
        ctx.fillStyle = pulse.color;
        ctx.shadowColor = pulse.color;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(currentX, currentY, 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Trail line
        const trailLength = 0.15;
        const trailStartX = pulse.fromNode.x + (pulse.toNode.x - pulse.fromNode.x) * Math.max(0, pulse.progress - trailLength);
        const trailStartY = pulse.fromNode.y + (pulse.toNode.y - pulse.fromNode.y) * Math.max(0, pulse.progress - trailLength);

        ctx.strokeStyle = pulse.color;
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(trailStartX, trailStartY);
        ctx.lineTo(currentX, currentY);
        ctx.stroke();

        ctx.shadowBlur = 0; // reset blur
      }

      // E. Draw Neural Network Nodes (Layer Neurons)
      neuralNodes.forEach(node => {
        const pulse = (Math.sin(time * 2 + node.pulsePhase) + 1) / 2; // 0..1
        const nodeRadius = 3.5 + pulse * 1.5;

        // Outer glow halo
        ctx.fillStyle = `rgba(56, 189, 248, ${0.12 + pulse * 0.25})`;
        ctx.beginPath();
        ctx.arc(node.x, node.y, nodeRadius * 2.8, 0, Math.PI * 2);
        ctx.fill();

        // Middle ring
        ctx.strokeStyle = `rgba(129, 140, 248, ${0.4 + pulse * 0.4})`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(node.x, node.y, nodeRadius * 1.5, 0, Math.PI * 2);
        ctx.stroke();

        // Inner solid core
        ctx.fillStyle = pulse > 0.6 ? '#ffffff' : '#38bdf8';
        ctx.beginPath();
        ctx.arc(node.x, node.y, nodeRadius, 0, Math.PI * 2);
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0 select-none">
      {/* 1. Deep Space Cyber Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#030712] via-[#051124] to-[#020713]" />

      {/* 2. Volumetric Ambient Neural Glow Orbs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.15, 0.28, 0.15],
          x: [0, 30, 0],
          y: [0, -20, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-600/20 rounded-full blur-[130px]"
      />
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.12, 0.24, 0.12],
          x: [0, -25, 0],
          y: [0, 30, 0],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute bottom-1/4 right-1/4 w-[550px] h-[550px] bg-indigo-600/20 rounded-full blur-[140px]"
      />
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.08, 0.18, 0.08],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute top-10 right-10 w-[400px] h-[400px] bg-purple-600/15 rounded-full blur-[120px]"
      />

      {/* 3. Interactive Multi-Layer Neural Network & Particle Simulation Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-auto opacity-80"
      />

      {/* 4. Cybernetic Scanning Laser Pulse Sweep */}
      <motion.div
        animate={{ y: [0, 600, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#38bdf8] opacity-35"
      />

      {/* 5. Floating ML/DL Research Badges & Formula Micro-Cards */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Badge 1: Neural Transformer Architecture (Top Left) */}
        <motion.div
          animate={{ y: [0, -10, 0], rotate: [-1, 1, -1] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-12 left-8 lg:left-16 hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950/70 border border-cyan-500/30 backdrop-blur-md shadow-xl"
        >
          <Brain className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span className="text-[11px] font-mono font-semibold text-cyan-200">
            Transformer :: Multi-Head Attention (128x)
          </span>
        </motion.div>

        {/* Badge 2: Loss Convergence & Tensor Flow (Top Right) */}
        <motion.div
          animate={{ y: [0, 12, 0], rotate: [1, -1, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
          className="absolute top-14 right-12 lg:right-24 hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950/70 border border-emerald-500/30 backdrop-blur-md shadow-xl"
        >
          <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span className="text-[11px] font-mono font-semibold text-emerald-200">
            ∇L Loss: 0.0024 • Model Converged
          </span>
        </motion.div>

        {/* Badge 3: Distributed GPU Cluster (Bottom Left) */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
          className="absolute bottom-20 left-10 lg:left-20 hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950/70 border border-indigo-500/30 backdrop-blur-md shadow-xl"
        >
          <Cpu className="w-3.5 h-3.5 text-indigo-400" />
          <span className="text-[11px] font-mono font-semibold text-indigo-200">
            PyTorch 2.5 • CUDA Distributed Tensor Pipeline
          </span>
        </motion.div>

        {/* Badge 4: Innovation & Real-World Research (Bottom Center/Right) */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 6.2, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute bottom-16 right-16 hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950/70 border border-amber-500/30 backdrop-blur-md shadow-xl"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-[11px] font-mono font-semibold text-amber-200">
            Research &amp; Innovation Hub • Peer-Reviewed
          </span>
        </motion.div>
      </div>

      {/* 6. Contrast-Balancing Vignette & Dark Gradient Mask */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#06142a] via-[#06142a]/65 to-[#06142a]/75 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_75%_55%_at_50%_35%,rgba(6,20,42,0.35),#06142a)] pointer-events-none" />
    </div>
  );
};
