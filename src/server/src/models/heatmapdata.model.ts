export class HeatmapData {
  date: string;
  total_hours: number;

  constructor(date: string, total_hours: number) {
    this.date = date;
    this.total_hours = total_hours;
  }
}
