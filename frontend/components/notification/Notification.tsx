'use client';
interface Notification {
  orderId: number;
  total: number;
}
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSocket } from '@/lib/sockets';
console.log('notificationnnnnnnnnnnnnnnnnn');
export default function Notification() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification | null>(null);
  useEffect(() => {
    const socket = getSocket();
    socket.on('newOrder', (data: Notification) => {
      setNotifications(data);
      setTimeout(() => setNotifications(null), 5000);
    });
    return () => {
      socket.off('newOrder');
    };
  }, []);
  if (!notifications) return null;
  return (
    <div
      className="fixed bottom-5 right-5 bg-white shadow-lg rounded-lg p-4 cursor-pointer w-80 border z-50"
      onClick={() => router.push(`/orders/${notifications.orderId}`)}
    >
      <h3 className="font-semibold">New Order</h3>
      <p className="text-sm text-gray-600">
        Order ID: {notifications.orderId}, Total: ${notifications.total}
      </p>
      <span className="text-blue-500 text-sm">View details →</span>
    </div>
  );
}
