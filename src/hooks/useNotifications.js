import { useEffect, useState, useCallback } from 'react';
import { connectSocket } from '../services/socket';
import { getRequest, putRequest } from '../services';
import { APICONFIG } from '../Redux/ApiConfig';

export function useNotifications(userId) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);

  const fetchUnreadCount = useCallback(async () => {
    if (!userId) return;
    try {
      const res = await getRequest(APICONFIG.NOTIFICATIONS_UNREAD_COUNT);
      setUnreadCount(res?.count || 0);
    } catch {
      /* API may not be deployed yet */
    }
  }, [userId]);

  const fetchNotifications = useCallback(async () => {
    if (!userId) return;
    try {
      const res = await getRequest(`${APICONFIG.NOTIFICATIONS}?limit=20`);
      setNotifications(res?.notifications || []);
    } catch {
      setNotifications([]);
    }
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    fetchUnreadCount();
    fetchNotifications();

    const socket = connectSocket(userId);
    const onNotification = (data) => {
      setNotifications((prev) => [data, ...prev]);
      setUnreadCount((c) => c + 1);
    };
    socket.on('notification', onNotification);
    return () => socket.off('notification', onNotification);
  }, [userId, fetchUnreadCount, fetchNotifications]);

  const markAsRead = async (id) => {
    try {
      await putRequest(`${APICONFIG.NOTIFICATIONS}/${id}/read`, {});
      setNotifications((prev) =>
        prev.map((n) => (n._id === id || n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch {
      /* ignore */
    }
  };

  return {
    notifications,
    unreadCount,
    open,
    setOpen,
    fetchNotifications,
    markAsRead,
  };
}
