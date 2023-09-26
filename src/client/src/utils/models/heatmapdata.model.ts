export interface HeatmapData {
  date: string;
  total_hours: number;
}

export interface HeatmapDataResponse {
  heatmapData: HeatmapData[];
  max_hours: number;
}
