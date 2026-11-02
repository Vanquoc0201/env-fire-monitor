import React from "react"
import { Header } from "@/components/common/Header"
import { Footer } from "@/components/common/Footer"

interface MainLayoutProps {
  children: React.ReactNode
  isConnected: boolean
  deviceId?: string
}

export const MainLayout = ({ children, isConnected, deviceId }: MainLayoutProps) => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
      {/* Header dùng chung */}
      <Header isConnected={isConnected} deviceId={deviceId} />

      {/* Nội dung thay đổi của từng trang */}
      <main className="container mx-auto px-4 md:px-8 py-6 flex-1 space-y-6">
        {children}
      </main>

      {/* Footer dùng chung */}
      <Footer />
    </div>
  )
}