export interface IGeoJson {
    type: string;
    geometry: {
      type: string;
      coordinates: number[]
    };
    properties: {};
}
