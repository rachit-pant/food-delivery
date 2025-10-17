"use client"
import { api } from "@/api/api"
import { handleError } from "@/lib/handleError"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"
import { Button } from "../ui/button"
import { useRouter } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Clock } from "lucide-react"

type Root = Root2[]

interface Root2 {
  orderId: number
  placedAt: string
  status: string
  amounts: Amounts
  payment: Payment
  restaurant: Restaurant
  deliveryAddress: DeliveryAddress
  items: Item[]
}

interface Amounts {
  subtotal: number
  discount: number
  delivery: number
  total: number
}

interface Payment {
  mode: string
  status: string
}

interface Restaurant {
  name: string
  image: string
}

interface DeliveryAddress {
  street: string
  city: string
}

interface Item {
  name: string
  variant: string
  price: number
  quantity: number
  image: string
}

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    delivered: "bg-emerald-100 text-emerald-800",
    preparing: "bg-amber-100 text-amber-800",
    picked: "bg-blue-100 text-blue-800",
    accepted: "bg-blue-100 text-blue-800",
    prepared: "bg-purple-100 text-purple-800",
    placed: "bg-slate-100 text-slate-800",
    cancelled: "bg-red-100 text-red-800",
  }
  return colors[status] || "bg-slate-100 text-slate-800"
}

const OrdersHistory = () => {
  const router = useRouter()
  const [orders, setOrders] = useState<Root>([])
  const [status, setStatus] = useState("picked")

  useEffect(() => {
    async function fetchData() {
      try {
        const res = (await api.get("/users/orders", { params: { status } })).data as Root
        setOrders(res)
        console.log("orders", res)
      } catch (error) {
        const err = handleError(error)
        console.error(err)
      }
    }
    fetchData()
  }, [status])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Order History</h1>
            <p className="text-slate-600 mt-1">Track and manage your past orders</p>
          </div>
          <Select onValueChange={setStatus} defaultValue={status}>
            <SelectTrigger className="w-full md:w-48 bg-white border-slate-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="placed">Placed</SelectItem>
              <SelectItem value="accepted">Accepted</SelectItem>
              <SelectItem value="preparing">Preparing</SelectItem>
              <SelectItem value="prepared">Prepared</SelectItem>
              <SelectItem value="picked">Picked</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {orders.length === 0 ? (
          <Card className="border-slate-200 bg-white">
            <CardContent className="pt-12 pb-12 text-center">
              <p className="text-slate-500 text-lg">No orders found with this status.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card
                key={order.orderId}
                className="border-slate-200 bg-white hover:shadow-md transition-shadow overflow-hidden"
              >
                <CardHeader className="">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-bold text-slate-900">Order #{order.orderId}</h3>
                        <Badge className={`${getStatusColor(order.status)} font-medium`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-600">
                        <div className="flex items-center gap-1">
                          <Clock size={16} />
                          {new Date(order.placedAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin size={16} />
                          {order.deliveryAddress.city}
                        </div>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-slate-200">
                      <p className="text-xs text-slate-600 font-medium">Total Amount</p>
                      <p className="text-2xl font-bold text-orange-600">${order.amounts.total}</p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-4">
                  <div className="flex items-center gap-3 mb-4 p-3 rounded-lg">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${order.restaurant.image}`}
                      alt={order.restaurant.name}
                      width={48}
                      height={48}
                      className="rounded-md object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900">{order.restaurant.name}</p>
                      <p className="text-sm text-slate-600">{order.deliveryAddress.street}</p>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div className="mb-4">
                    <p className="text-sm font-semibold text-slate-900 mb-3">Items Ordered</p>
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded">
                          <div className="flex items-center gap-3 flex-1">
                            <Image
                              src={`http://backend:5000${item.image}`}
                              alt={item.name}
                              width={40}
                              height={40}
                              className="rounded-md object-cover"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-slate-900 text-sm">{item.name}</p>
                              <p className="text-xs text-slate-500">
                                {item.variant} × {item.quantity}
                              </p>
                            </div>
                          </div>
                          <p className="font-semibold text-slate-900 ml-2">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div className="rounded-lg p-4 mb-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Subtotal</span>
                      <span className="text-slate-900 font-medium">${order.amounts.subtotal.toFixed(2)}</span>
                    </div>
                    {order.amounts.discount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Discount</span>
                        <span className="text-emerald-600 font-medium">-${order.amounts.discount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Delivery</span>
                      <span className="text-slate-900 font-medium">${order.amounts.delivery.toFixed(2)}</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-slate-900">Total</span>
                      <span className="text-xl font-bold text-orange-600">${order.amounts.total.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <p className="text-sm text-slate-600">
                      Paid via <span className="font-medium text-slate-900">{order.payment.mode}</span>{" "}
                      <span
                        className={`font-medium ${order.payment.status === "Completed" ? "text-emerald-600" : "text-red-600"
                          }`}
                      >
                        ({order.payment.status})
                      </span>
                    </p>
                    <Button
                      onClick={() => router.push(`/delivery/${order.orderId}/user`)}
                      className="bg-orange-600 hover:bg-orange-700 text-white font-medium"
                    >
                      Track Order
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default OrdersHistory
