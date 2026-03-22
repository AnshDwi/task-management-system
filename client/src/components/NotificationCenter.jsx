function NotificationCenter({ notifications, onDismiss }) {
  return (
    <div className="notification-stack">
      {notifications.map((notification) => (
        <div key={notification.id} className={`toast ${notification.type || "info"}`}>
          <div>
            <strong>{notification.title}</strong>
            <p>{notification.message}</p>
          </div>
          <button type="button" className="toast-close" onClick={() => onDismiss(notification.id)}>
            x
          </button>
        </div>
      ))}
    </div>
  );
}

export default NotificationCenter;
