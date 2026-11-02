export interface TelemetryData {
  id?: string;
  deviceId: string;
  temperature: number;
  humidity: number;
  gas: number;
  flame: boolean;
  createdAt?: string;
}