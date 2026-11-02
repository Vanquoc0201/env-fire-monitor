import { Flame, Radio } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ModeToggle } from "./mode-toggle"

interface HeaderProps {
  isConnected: boolean
  deviceId?: string
}

export const Header = ({ isConnected, deviceId }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-8 mx-auto">
        {/* Logo & Tên Hệ Thống */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400">
            <Flame className="h-6 w-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">Hệ Thống Giám Sát PCCC Realtime</h1>
            <p className="text-xs text-muted-foreground">
              Thiết bị : <span className="font-mono font-medium text-foreground">{deviceId || 'ESP32_FIRE_MONITOR'}</span>
            </p>
          </div>
        </div>

        {/* Status Badge & Theme Switcher */}
        <div className="flex items-center gap-3">
          <Badge 
            variant={isConnected ? "default" : "destructive"} 
            className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold"
          >
            <Radio className={`h-3.5 w-3.5 ${isConnected ? 'animate-ping' : ''}`} />
            {isConnected ? "Online" : "Disconnected"}
          </Badge>
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}