import { create } from "zustand";

interface NotificationData {
  type: "PAYMENT" | "TC" | "RECEIPT" | "DISCOUNT" | "DONATION";
  status: "SUCCESS" | "ERROR" | "WARNING" | "DEFAULT";
  userRole: "ADMIN" | "MANAGEMENT";
  seen: boolean;
  title: string;
  description: string;
  schoolId: string;
  action: string;
  createdAt: string;
  updatedAt: string;
}

interface NotificationStore {
  notifications: NotificationData[];
  setAllNotifications: (notificatiosn: NotificationData[]) => void;
  addNotification: (notification: NotificationData) => void;
}

const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  setAllNotifications: (notifications: NotificationData[]) => set(() => ({ notifications: notifications })),
  addNotification: (notification: NotificationData) =>
    set((state) => ({ notifications: [notification, ...state?.notifications] })),
}));

export default useNotificationStore;
