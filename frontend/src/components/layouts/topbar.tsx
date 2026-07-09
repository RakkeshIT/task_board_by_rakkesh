"use client";
import Logo from '../assets/Logo.png'
import Image from 'next/image';
import { useWebSocket } from '@/websocket/useWebSocket';
interface TopBarProps {
    boardName?: string;
}
const WS_URL = process.env.NODE_ENV === "production" ? process.env.NEXT_PUBLIC_PROD_WS_URL! : process.env.NEXT_PUBLIC_WS_URL!

export default function TopBar({
    boardName = "Real-Time Task Board",
}: TopBarProps) {
    const { isConnected, onlineCount} = useWebSocket(WS_URL)
    return (
        <header className="sticky top-0 z-50 border-b border-emerald-100 bg-white/70 backdrop-blur-md shadow-sm shadow-emerald-900/5">
    <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Left: brand + board name */}
        <div className="flex items-center gap-3">
            <div className="relative h-7 w-7 sm:h-8 sm:w-8 lg:h-9 lg:w-9 shrink-0 rounded-lg bg-emerald-50 ring-1 ring-emerald-500/30">
                <Image
                    src={Logo}
                    alt="Task Board"
                    fill
                    sizes="(max-width: 640px) 28px, (max-width: 1024px) 32px, 36px"
                    className="object-contain p-1"
                    priority
                />
            </div>
            <h1 className="text-sm font-semibold tracking-tight text-emerald-900 sm:text-base">
                {boardName}
            </h1>
        </div>

        {/* Right: connection status + presence */}
        <div className="flex flex-wrap items-center justify-end gap-2">
            <div
                className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium backdrop-blur-sm transition-colors ${
                    isConnected
                        ? "border-emerald-300 bg-emerald-50/80 text-emerald-700"
                        : "border-amber-300 bg-amber-50/80 text-amber-700"
                }`}
            >
                <span className="relative flex h-2 w-2">
                    {isConnected && (
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    )}
                    <span
                        className={`relative inline-flex h-2 w-2 rounded-full ${
                            isConnected ? "bg-emerald-500" : "bg-amber-500"
                        }`}
                    />
                </span>
                {isConnected ? "Connected" : "Reconnecting…"}
            </div>

            <div className="flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50/80 px-3 py-1 text-xs font-medium text-emerald-700 backdrop-blur-sm">
                <span className="text-emerald-500">👥</span>
                <span className="hidden sm:inline">{onlineCount} online</span>
                <span className="sm:hidden">{onlineCount}</span>
            </div>
        </div>
    </div>
</header>
    );
}