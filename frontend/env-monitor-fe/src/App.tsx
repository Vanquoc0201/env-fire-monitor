import { useTelemetry } from "./features/telemetry/hooks/useTelemetry";
import { MetricCard } from "./features/telemetry/components/MetricCard";
import { FireAlertBanner } from "./features/telemetry/components/FireAlertBanner";
import { MainLayout } from "./layouts/MainLayout";
import { Thermometer, Droplets, Wind, Flame } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function App() {
  const { latestData, history, isConnected } = useTelemetry();

  return (
    <MainLayout isConnected={isConnected} deviceId={latestData?.deviceId}>
      {/* Banner Cảnh Báo phát sáng & âm thanh */}
      <FireAlertBanner data={latestData} />

      {/* Grid Thông Số Cảm Biến Realtime kèm Progress Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          title="Nhiệt độ"
          value={latestData?.temperature ?? "--"}
          unit="°C"
          icon={Thermometer}
          max={100}
          colorClass={latestData && latestData.temperature > 45 ? "text-red-500" : "text-orange-500"}
        />
        <MetricCard
          title="Độ ẩm"
          value={latestData?.humidity ?? "--"}
          unit="%"
          icon={Droplets}
          max={100}
          colorClass="text-blue-500"
        />
        <MetricCard
          title="Khí Gas (MQ-2)"
          value={latestData?.gas ?? "--"}
          unit="PPM"
          icon={Wind}
          max={3000}
          colorClass={latestData && latestData.gas > 1500 ? "text-red-500" : "text-emerald-500"}
        />
        <MetricCard
          title="Trạng thái Lửa"
          value={latestData?.flame ? "CÓ LỬA!" : "An toàn"}
          icon={Flame}
          colorClass={latestData?.flame ? "text-red-600 animate-bounce" : "text-gray-400"}
        />
      </div>

      {/* Biểu đồ Biến thiên Realtime - 2 Trục Y tách biệt & Gradient */}
      <div className="bg-card text-card-foreground p-5 rounded-xl border shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm">Biểu đồ biến thiên Nhiệt độ & Gas (20 bản ghi gần nhất)</h3>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1 text-orange-500 font-medium">
              <span className="h-2.5 w-2.5 rounded-full bg-orange-500"></span> Nhiệt độ (°C)
            </span>
            <span className="flex items-center gap-1 text-emerald-500 font-medium">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span> Khí Gas (PPM)
            </span>
          </div>
        </div>

        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={[...history].reverse()}>
              <defs>
                <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorGas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="createdAt" tickFormatter={(str) => new Date(str).toLocaleTimeString()} />
              {/* Trục Y trái dành cho Nhiệt độ */}
              <YAxis yAxisId="left" orientation="left" domain={[0, 100]} unit="°C" />
              {/* Trục Y phải dành cho Khí Gas */}
              <YAxis yAxisId="right" orientation="right" domain={[0, 3000]} unit=" PPM" />
              <Tooltip />
              <Area yAxisId="left" type="monotone" dataKey="temperature" stroke="#f97316" fillOpacity={1} fill="url(#colorTemp)" name="Nhiệt độ" strokeWidth={2} />
              <Area yAxisId="right" type="monotone" dataKey="gas" stroke="#10b981" fillOpacity={1} fill="url(#colorGas)" name="Khí Gas" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </MainLayout>
  );
}