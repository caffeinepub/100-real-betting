import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useState } from "react";
import type { Notification, Page } from "../App";

interface NotificationsPanelProps {
  open: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkRead: (id: string) => void;
  onNavigate: (p: Page) => void;
}

export function NotificationsPanel({
  open,
  onClose,
  notifications,
  onMarkRead,
  onNavigate,
}: NotificationsPanelProps) {
  const [expanded, setExpanded] = useState<string | null>(null);

  function toggle(id: string) {
    setExpanded((prev) => (prev === id ? null : id));
    onMarkRead(id);
  }

  return (
    <Sheet
      open={open}
      onOpenChange={(v) => {
        if (!v) onClose();
      }}
    >
      <SheetContent
        side="right"
        className="w-full sm:max-w-sm border-l border-border p-0"
        style={{ background: "oklch(0.14 0.08 285)" }}
        data-ocid="notifications.panel"
      >
        <SheetHeader className="p-4 border-b border-border">
          <SheetTitle className="text-gold font-display text-xl">
            Notifications
          </SheetTitle>
        </SheetHeader>

        <div className="overflow-y-auto h-[calc(100%-64px)] scrollbar-thin">
          {notifications.length === 0 ? (
            <div
              className="p-8 text-center text-muted-foreground"
              data-ocid="notifications.empty_state"
            >
              No notifications yet
            </div>
          ) : (
            notifications.map((n, i) => (
              <div
                key={n.id}
                data-ocid={`notifications.item.${i + 1}`}
                className={`border-b border-border transition-all ${n.read ? "opacity-70" : ""} hover:bg-white/5`}
              >
                <button
                  type="button"
                  onClick={() => toggle(n.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") toggle(n.id);
                  }}
                  className="w-full text-left"
                >
                  <div className="flex items-start gap-3 p-4">
                    <span className="text-2xl flex-shrink-0">{n.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p
                          className={`font-bold text-sm truncate ${
                            n.type === "promo"
                              ? "text-gold"
                              : n.type === "deposit"
                                ? "text-green-neon"
                                : n.type === "withdrawal"
                                  ? "text-cyan"
                                  : "text-foreground"
                          }`}
                        >
                          {n.title}
                        </p>
                        {!n.read && (
                          <span className="w-2 h-2 rounded-full bg-pink-accent flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">
                        {expanded === n.id ? "" : `${n.detail.slice(0, 50)}...`}
                      </p>
                    </div>
                  </div>
                </button>

                {expanded === n.id && (
                  <div className="px-4 pb-4 pt-0">
                    <p className="text-sm text-foreground/90 leading-relaxed">
                      {n.detail}
                    </p>
                    {n.link && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigate(n.link!);
                          onClose();
                        }}
                        data-ocid={`notifications.${n.link}.link`}
                        className={`mt-3 px-4 py-1.5 rounded-lg text-xs font-black text-black ${
                          n.link === "promotions" ? "bg-gold" : "bg-pink-accent"
                        }`}
                      >
                        {n.link === "promotions"
                          ? "View Promotions \u2192"
                          : "View VIP \u2192"}
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
