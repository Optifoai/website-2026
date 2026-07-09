import React from 'react';
import PropTypes from 'prop-types';
import { useNotifications } from '../../../hooks/useNotifications';

function NotificationBell({ userId }) {
  const { notifications, unreadCount, open, setOpen, markAsRead } =
    useNotifications(userId);

  return (
    <div className="notification-bell position-relative">
      <button
        type="button"
        className="btn btn-link p-0 notification-bell-btn"
        onClick={() => setOpen(!open)}
        aria-label="Notifications"
      >
        <img src="/images/icon/notification.svg" alt="" width={24} height={24}
          onError={(e) => { e.target.style.display = 'none'; }}
        />
        <span className="bell-icon-fallback">🔔</span>
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
        )}
      </button>

      {open && (
        <div className="notification-dropdown shadow">
          <div className="notification-dropdown-header">Notifications</div>
          {notifications.length === 0 ? (
            <p className="p-3 text-muted small">No notifications</p>
          ) : (
            <ul className="list-unstyled notification-list">
              {notifications.map((n) => (
                <li
                  key={n._id || n.id}
                  className={!n.isRead ? 'unread' : ''}
                  onClick={() => markAsRead(n._id || n.id)}
                >
                  <strong>{n.title}</strong>
                  <p className="small mb-0">{n.message}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

NotificationBell.propTypes = {
  userId: PropTypes.string,
};

export default NotificationBell;
