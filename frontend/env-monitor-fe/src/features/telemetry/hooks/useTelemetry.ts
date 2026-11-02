import { useEffect, useState } from 'react';
import { apiClient } from '../../../services/api';
import type { TelemetryData } from '../types/telemetry.type';
import { socket } from '@/services/sockets';

export const useTelemetry = () => {
  const [latestData, setLatestData] = useState<TelemetryData | null>(null);
  const [history, setHistory] = useState<TelemetryData[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(socket.connected);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const response = await apiClient.get<TelemetryData[]>('/telemetry/history?limit=20');
        setHistory(response.data);
        if (response.data.length > 0) {
          setLatestData(response.data[0]);
        }
      } catch (error) {
        console.error('Lỗi lấy lịch sử telemetry:', error);
      }
    };

    fetchInitialData();

    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);

    const onTelemetryUpdate = (newData: TelemetryData) => {
      setLatestData(newData);
      setHistory((prev) => [newData, ...prev.slice(0, 19)]); 
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('telemetryData', onTelemetryUpdate);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('telemetryData', onTelemetryUpdate);
    };
  }, []);

  return { latestData, history, isConnected };
};