export type PointY = number;

export type PointX = number;

export type Point = [PointX, PointY];

export type Layer = Point[];

export interface CreateCanvasOptions {
  delay: number;
}