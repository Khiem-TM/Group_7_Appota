import { Bell, Check, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  acceptInvitation,
  declineInvitation,
  getMyNotifications,
  markNotificationRead,
} from "../../api/invitations";

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "vừa xong";
  if (mins < 60) return `${mins} phút trước`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} giờ trước`;
  return `${Math.floor(hours / 24)} ngày trước`;
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [actioning, setActioning] = useState(null);
  const ref = useRef(null);

  const fetchNotifications = async () => {
    try {
      const data = await getMyNotifications();
      setNotifications(data);
    } catch {
      // silent — user may not be logged in yet
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const handleAccept = async (notification) => {
    setActioning(notification.id);
    try {
      await acceptInvitation(notification.related_id);
      await fetchNotifications();
    } catch (err) {
      alert(err.response?.data?.detail || "Không thể chấp nhận lời mời.");
    } finally {
      setActioning(null);
    }
  };

  const handleDecline = async (notification) => {
    setActioning(notification.id);
    try {
      await declineInvitation(notification.related_id);
      await fetchNotifications();
    } catch (err) {
      alert(err.response?.data?.detail || "Không thể từ chối lời mời.");
    } finally {
      setActioning(null);
    }
  };

  const handleMarkRead = async (notification) => {
    if (notification.is_read) return;
    try {
      await markNotificationRead(notification.id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notification.id ? { ...n, is_read: true } : n))
      );
    } catch {
      // silent
    }
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative inline-flex h-8 w-8 items-center justify-center rounded-full border border-outline-variant bg-surface-container-low text-on-surface-variant hover:text-white"
      >
        <Bell size={15} />
        {unreadCount > 0 ? (
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        ) : null}
      </button>

      {open ? (
        <div className="absolute right-0 top-10 z-50 w-80 rounded-2xl border border-outline-variant bg-surface-container-low shadow-xl">
          <div className="flex items-center justify-between border-b border-outline-variant px-4 py-3">
            <span className="text-sm font-semibold text-white">Thông báo</span>
            {unreadCount > 0 ? (
              <span className="rounded-full bg-red-500/20 px-2 py-0.5 text-xs font-semibold text-red-400">
                {unreadCount} chưa đọc
              </span>
            ) : null}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="px-4 py-6 text-center text-sm text-on-surface-variant">
                Không có thông báo nào.
              </p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleMarkRead(n)}
                  className={`border-b border-outline-variant/50 px-4 py-3 transition-colors ${
                    n.is_read ? "opacity-60" : "bg-primary-container/5"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {!n.is_read ? (
                      <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary-container" />
                    ) : (
                      <span className="mt-1.5 h-2 w-2 shrink-0" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-white">{n.title}</p>
                      {n.body ? (
                        <p className="mt-0.5 text-xs text-on-surface-variant">{n.body}</p>
                      ) : null}
                      <p className="mt-1 text-[11px] text-on-surface-variant/60">
                        {timeAgo(n.created_at)}
                      </p>

                      {n.type === "INVITE" && !n.is_read ? (
                        <div className="mt-2 flex gap-2">
                          <button
                            type="button"
                            disabled={actioning === n.id}
                            onClick={(e) => { e.stopPropagation(); handleAccept(n); }}
                            className="flex items-center gap-1 rounded-lg bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/30 disabled:opacity-50"
                          >
                            <Check size={12} /> Chấp nhận
                          </button>
                          <button
                            type="button"
                            disabled={actioning === n.id}
                            onClick={(e) => { e.stopPropagation(); handleDecline(n); }}
                            className="flex items-center gap-1 rounded-lg bg-red-500/20 px-3 py-1 text-xs font-semibold text-red-400 hover:bg-red-500/30 disabled:opacity-50"
                          >
                            <X size={12} /> Từ chối
                          </button>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
