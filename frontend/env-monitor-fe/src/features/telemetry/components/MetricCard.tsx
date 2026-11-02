import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: number | string;
  unit?: string;
  icon: LucideIcon;
  colorClass?: string;
  max?: number; 
}

export const MetricCard = ({
  title,
  value,
  unit = "",
  icon: Icon,
  colorClass = "text-primary",
  max,
}: MetricCardProps) => {
  const numericValue = typeof value === "number" ? value : 0;
  const progressPercent = max ? Math.min(Math.round((numericValue / max) * 100), 100) : 0;

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-5 space-y-3">
        <div className="flex items-center justify-between text-muted-foreground">
          <span className="text-sm font-medium">{title}</span>
          <Icon className={`h-5 w-5 ${colorClass}`} />
        </div>

        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold tracking-tight">{value}</span>
          {unit && <span className="text-xs text-muted-foreground font-semibold">{unit}</span>}
        </div>

        {max && (
          <div className="space-y-1 pt-1">
            <div className="flex justify-between text-[11px] text-muted-foreground font-medium">
              <span>Mức độ nguy hiểm</span>
              <span>{progressPercent}%</span>
            </div>
            <Progress value={progressPercent} className="h-1.5" />
          </div>
        )}
      </CardContent>
    </Card>
  );
};