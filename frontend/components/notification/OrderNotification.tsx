"use client"
import { getSocket } from "@/lib/sockets"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { api } from "@/api/api"
import { CheckCircle2, MapPin, Package } from "lucide-react"

interface Orders {
  id: number
  net_amount: number
  payment_status: string
  order_items: OrderItems[]
  order_addresses: {
    address: string
  }
  restaurants: {
    name: string
  }
}

interface OrderItems {
  product_name: string
  quantity: number
}

const OrderNotification = () => {
  const [orderRequest, setOrderRequest] = useState<Orders | null>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const socket = getSocket()

    socket.on("OrderRequest", (data: Orders) => {
      setOrderRequest(data)

      toast("🎉 New Order Received!", {
        description: `Order #${data.id} • Total: ₹${data.net_amount}`,
        duration: 10000,
        action: {
          label: "View Details",
          onClick: () => setOpen(true),
        },
      })
    })

    return () => {
      socket.off("OrderRequest")
    }
  }, [])

  const handleAccept = async () => {
    try {
      const res = await api.patch(`/orders/delivered/${orderRequest?.id}`)
      toast("✅ Order Accepted!", {
        duration: 5000,
      })
      setOrderRequest(null)
    } catch (error) {
      console.log(error)
      toast("❌ Order Rejected!", {
        duration: 5000,
      })
    }
    setOpen(false)
  }

  return (
    <div>
      <Dialog
        open={open}
        onOpenChange={(val) => {
          setOpen(val)
          if (!val) setOrderRequest(null)
        }}
      >
        <DialogContent className="max-w-md border-0 shadow-2xl">
          {orderRequest && (
            <>
              <DialogHeader className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-orange-600">
                    <Package className="h-5 w-5 text-white" />
                  </div>
                  <DialogTitle className="text-xl font-bold">New Order Request</DialogTitle>
                </div>
              </DialogHeader>

              <div className="space-y-4 py-4">

                <div className="rounded-lg bg-gradient-to-r from-slate-50 to-slate-100 p-4">
                  <p className="text-sm font-semibold text-slate-600">Restaurant</p>
                  <p className="mt-1 text-lg font-bold text-slate-900">{orderRequest.restaurants.name}</p>
                </div>

                <div className="flex gap-3">
                  <MapPin className="h-5 w-5 flex-shrink-0 text-orange-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-slate-600">Delivery Address</p>
                    <p className="mt-1 text-sm text-slate-700">{orderRequest.order_addresses.address}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border border-slate-200 bg-white p-3">
                    <p className="text-xs font-semibold text-slate-500 uppercase">Order ID</p>
                    <p className="mt-1 font-bold text-slate-900">#{orderRequest.id}</p>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-white p-3">
                    <p className="text-xs font-semibold text-slate-500 uppercase">Amount</p>
                    <p className="mt-1 font-bold text-orange-600">₹{orderRequest.net_amount.toFixed(2)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2">
                  <CheckCircle2 className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">{orderRequest.payment_status}</span>
                </div>


                <div>
                  <p className="mb-2 text-sm font-semibold text-slate-600">Items</p>
                  <div className="space-y-2">
                    {orderRequest.order_items.map((item) => (
                      <div key={item.product_name} className="flex justify-between rounded-lg bg-slate-50 px-3 py-2">
                        <span className="text-sm text-slate-700">{item.product_name}</span>
                        <span className="font-semibold text-slate-900">×{item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <DialogFooter className="gap-2 pt-4">
                <DialogClose asChild>
                  <Button
                    variant="outline"
                    className="flex-1 border-slate-300 text-slate-700 hover:bg-slate-50 bg-transparent"
                  >
                    Decline
                  </Button>
                </DialogClose>
                <Button
                  onClick={handleAccept}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold"
                >
                  Accept Order
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default OrderNotification
