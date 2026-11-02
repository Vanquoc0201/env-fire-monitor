import { useEffect, useRef } from "react";
import { ShieldAlert, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { TelemetryData } from "../types/telemetry.type";


interface FireAlertBannerProps {
  data: TelemetryData | null;
}

export const FireAlertBanner = ({ data }: FireAlertBannerProps) => {
  const isDanger = data?.flame || (data?.gas && data.gas > 1500) || (data?.temperature && data.temperature > 45);
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (isDanger) {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(880, ctx.currentTime); 
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    }
  }, [isDanger, data]);

  if (!isDanger) {
    return (
      <Alert className="border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
        <AlertTitle className="font-bold">Hệ Thống An Toàn</AlertTitle>
        <AlertDescription className="text-xs">
          Không phát hiện nhiệt độ cao, rò rỉ khí gas hoặc nguy cơ cháy nổ.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert className="border-red-500 bg-red-500/10 text-red-600 dark:text-red-400 animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.35)]">
      <ShieldAlert className="h-6 w-6 text-red-500 animate-bounce" />
      <AlertTitle className="font-extrabold text-base tracking-wide">
        🚨 CẢNH BÁO NGUY HIỂM PCCC!
      </AlertTitle>
      <AlertDescription className="text-xs font-medium mt-1">
        Phát hiện bất thường: {data?.flame && "[CÓ LỬA!] "}
        {data?.temperature && data.temperature > 45 && `[Nhiệt độ cao: ${data.temperature}°C] `}
        {data?.gas && data.gas > 1500 && `[Rò rỉ Gas: ${data.gas} PPM]`}
      </AlertDescription>
    </Alert>
  );
};