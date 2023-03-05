/// <reference types="vite/client" />

type Point = number[];
type MessageLevel = 'warning' | 'error' | 'off';
type CanvasLayers = { point: Layer, image: string }

interface CanvasLayerOptions {
  // 画笔大小
  size: number;
  // 画笔颜色
  color: string;
  // 画布像素位
  ratio: number;
  // 画笔软化
  soften: number;
  // 最大栈
  maxStack: number;
  // 曲线优化
  optimize: number;
}

interface CursorMoveEventOptions {
  delay: number; // 节流
  distance: number; // 两个点的距离大于才记录
}

interface CreateCanvasOptions extends CanvasLayerOptions, CursorMoveEventOptions {
  // 空壳
}

type CursorMoveEventHandle = (key: 'set' | 'end', point: Point) => void
