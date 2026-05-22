import Notification from "../models/notification.model.js";

// Get all notifications for a user
export const getNotifications = async (req, res) => {
    try {
        const userId = req.id; // Assuming auth middleware sets req.id
        
        // Return empty notifications if not authenticated
        if (!userId) {
            return res.status(200).json({
                success: true,
                notifications: []
            });
        }
        
        const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            notifications
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch notifications"
        });
    }
};

// Mark notification as read
export const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const notification = await Notification.findByIdAndUpdate(id, { isRead: true }, { new: true });
        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found"
            });
        }
        res.status(200).json({
            success: true,
            notification
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to mark notification as read"
        });
    }
};

// Create a new notification (internal function)
export const createNotification = async (userId, type, title, message, relatedId = null) => {
    try {
        const notification = new Notification({
            userId,
            type,
            title,
            message,
            relatedId
        });
        await notification.save();
        return notification;
    } catch (error) {
        console.log("Error creating notification:", error);
        return null;
    }
};

// Delete a notification
export const deleteNotification = async (req, res) => {
    try {
        const { id } = req.params;
        const notification = await Notification.findByIdAndDelete(id);
        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found"
            });
        }
        res.status(200).json({
            success: true,
            message: "Notification deleted"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to delete notification"
        });
    }
};
