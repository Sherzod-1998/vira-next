export type NotificationStatus = 'WAIT' | 'READ' | string;

export interface Notification {
  _id: string;
  notificationType: string;
  notificationStatus: NotificationStatus;
  notificationGroup: string;
  notificationTitle: string;
  notificationDesc?: string | null;
  authorId: string;
  receiverId: string;
  productId?: string | null;
  articleId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationListResult {
  list: Notification[];
  total: number;
  page: number;
  limit: number;
}
