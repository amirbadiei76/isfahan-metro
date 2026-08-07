export interface Station {
  id: number;
  name: string;
  x: number;
  y: number;
  lat: number;
  lon: number;
  textX?: number;
  textY?: number;
  arrowX: number;
  arrowY: number;
  arrowRotation: number;
  line: number;
}
