/// <reference types="vite/client" />

type Point = [number, number];
type MessageLevel = 'warning' | 'error' | 'off';
type CanvasLayers = { point: Layer, image: string }

interface CreateCanvasOptions {
  size: number; // 画笔大小
  delay: number; // 节流
  color: string; // 画笔颜色
  soften: number; // 画笔软化
  maxStack: number; // 最大栈
  optimize: number; // 曲线优化
  distance: number; // 两个点的距离大于才记录
}
