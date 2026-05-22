import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Bell, Check, Trash2 } from 'lucide-react';
import axios from 'axios';
import { setNotifications, markAsRead, deleteNotification, setLoading } from '../redux/notificationSlice';
import { NOTIFICATION_API_ENDPOINT } from '../utils/data';

const Notification = () => {
  const dispatch = useDispatch();
  const { notifications, loading } = useSelector(state => state.notification);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      dispatch(setLoading(true));
      const res = await axios.get(`${NOTIFICATION_API_ENDPOINT}`, {
        withCredentials: true,
        validateStatus: (status) => status < 500 // Accept all statuses below 500
      });
      if (res.status === 200 && res.data.success) {
        dispatch(setNotifications(res.data.notifications));
      }
    } catch (error) {
      if (error.response?.status !== 401) {
        console.error('Error fetching notifications:', error);
      }
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      const res = await axios.put(`${NOTIFICATION_API_ENDPOINT}/${id}/read`, {}, {
        withCredentials: true
      });
      if (res.data.success) {
        dispatch(markAsRead(id));
      }
    } catch (error) {
      if (error.response?.status !== 401) {
        console.error('Error marking notification as read:', error);
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(`${NOTIFICATION_API_ENDPOINT}/${id}`, {
        withCredentials: true
      });
      if (res.data.success) {
        dispatch(deleteNotification(id));
      }
    } catch (error) {
      if (error.response?.status !== 401) {
        console.error('Error deleting notification:', error);
      }
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
      >
        <Bell size={24} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border z-50">
          <div className="p-4 border-b">
            <h3 className="text-lg font-semibold">Notifications</h3>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500">Loading...</div>
            ) : notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">No notifications</div>
            ) : (
              notifications.map(notification => (
                <div
                  key={notification._id}
                  className={`p-4 border-b hover:bg-gray-50 ${!notification.isRead ? 'bg-blue-50' : ''}`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{notification.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex space-x-2 ml-2">
                      {!notification.isRead && (
                        <button
                          onClick={() => handleMarkAsRead(notification._id)}
                          className="text-green-500 hover:text-green-700"
                        >
                          <Check size={16} />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(notification._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Notification;
