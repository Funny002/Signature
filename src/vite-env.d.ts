/// <reference types="vite/client" />
type PointY = number;
type PointX = number;
type Point = [PointX, PointY];
type base64String = string;
type Layer = Point[];
type CanvasLayers = { point: Layer, image: base64String }

interface CreateCanvasOptions {
  delay: number;
}
