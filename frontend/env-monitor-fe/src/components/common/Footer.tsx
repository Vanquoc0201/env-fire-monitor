import { ShieldAlert, Cpu } from "lucide-react"

export const Footer = () => {
  return (
    <footer className="w-full border-t bg-background py-4 mt-auto">
      <div className="container flex flex-col items-center justify-between gap-3 md:h-12 md:flex-row px-4 md:px-8 mx-auto text-sm text-muted-foreground">
        {/* Bản quyền & Tên hệ thống */}
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-orange-500" />
          <span>&copy; {new Date().getFullYear()} Fire & Environment Guard System.</span>
        </div>

        {/* Stack Công nghệ */}
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1">
            <Cpu className="h-3.5 w-3.5" /> ESP32 Telemetry
          </span>
        </div>
      </div>
    </footer>
  )
}