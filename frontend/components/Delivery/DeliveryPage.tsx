"use client"
import { useEffect, useState, useCallback, useRef } from "react"
import { GoogleMap, Marker, Polyline, LoadScript } from "@react-google-maps/api"
import { api } from "@/api/api"
import { getSocket } from "@/lib/sockets"
import { DollarSign, ChefHat } from "lucide-react"

export interface Order {
  id: number
  user_id: number
  restaurant_id: number
  total_amount: number
  discount_amount: number
  delivery_charges: number
  tax_amount: number
  net_amount: number
  delivery_agent_id: number
  payment_status: string
  status: string
  createdAt: string
  updatedAt: string
  order_items: OrderItem[]
  order_payments: OrderPayment[]
}

export interface OrderItem {
  id: number
  order_id: number
  menu_id: number
  variant_id: number
  price: number
  quantity: number
  total_amount: number
  product_name: string
}

export interface OrderPayment {
  id: number
  order_id: number
  amount: number
  payment_mode: string
  payment_status: string
}

interface Coordinates {
  restaurant_address: string
  restaurant_lat: number
  restaurant_lng: number
  restaurant_name: string
  restaurant_id: number
  user_address: string
  user_address_lat: number
  user_address_lng: number
  user_address_id: number
  order_id: number
}

interface DeliveryAgentLocation {
  lat: number
  lng: number
  orderId: number
}

const containerStyle = {
  width: "100%",
  height: "100%",
}

const DeliveryPage = ({ orderId }: { orderId: string }) => {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null)
  const [orderDetails, setOrderDetails] = useState<Order | null>(null)
  const [routePath, setRoutePath] = useState<google.maps.LatLngLiteral[]>([])
  const [deliveryAgentLocation, setDeliveryAgentLocation] = useState<DeliveryAgentLocation | null>(null)
  const mapRef = useRef<google.maps.Map | null>(null)

  useEffect(() => {
    const socket = getSocket()
    socket.emit("OrderId", orderId)
    socket.emit("joinRoom", orderId)
    const handleOrderLocations = (data: Coordinates) => {
      console.log(" OrderLocations received")
      setCoordinates(data)
      console.log("OrderLocations data:", data)
    }
    socket.on("OrderLocations", handleOrderLocations)
    socket.on("DeliveryAgentLocation", (data: DeliveryAgentLocation) => {
      setDeliveryAgentLocation(data)
    })
    return () => {
      socket.off("OrderLocations", handleOrderLocations)
    }
  }, [orderId])

  useEffect(() => {
    if (!coordinates?.order_id) return
    const fetchOrderDetails = async () => {
      try {
        const { data } = await api.get(`/orders/info/${coordinates.order_id}`)
        setOrderDetails(data)
        console.log("OrderDetails data:", data)
      } catch (err) {
        console.error("Failed to fetch order details:", err)
      }
    }
    fetchOrderDetails()
  }, [coordinates?.order_id])

  const onLoad = useCallback(
    (map: google.maps.Map) => {
      mapRef.current = map
      if (coordinates) {
        calculateRoute(coordinates)
      }
    },
    [coordinates],
  )

  const calculateRoute = (coords: Coordinates) => {
    if (!google || !mapRef.current) return

    const { restaurant_lat, restaurant_lng, user_address_lat, user_address_lng } = coords
    if (
      restaurant_lat == null ||
      restaurant_lng == null ||
      user_address_lat == null ||
      user_address_lng == null ||
      deliveryAgentLocation?.lat == null ||
      deliveryAgentLocation?.lng == null
    )
      return

    const directionsService = new google.maps.DirectionsService()
    directionsService.route(
      {
        origin: {
          lat: deliveryAgentLocation?.lat,
          lng: deliveryAgentLocation?.lng,
        },
        destination: { lat: user_address_lat, lng: user_address_lng },
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK" && result?.routes[0]) {
          const points = result.routes[0].overview_path.map((p) => ({
            lat: p.lat(),
            lng: p.lng(),
          }))
          setRoutePath(points)
        } else {
          console.error("Route request failed:", status)
        }
      },
    )
  }

  const center = coordinates
    ? {
      lat: (coordinates.restaurant_lat + coordinates.user_address_lat) / 2,
      lng: (coordinates.restaurant_lng + coordinates.user_address_lng) / 2,
    }
    : { lat: 20.5937, lng: 78.9629 }

  useEffect(() => {
    if (coordinates && mapRef.current) {
      calculateRoute(coordinates)
    }
  }, [coordinates, deliveryAgentLocation])

  return (
    <div className="h-screen w-full flex flex-col bg-slate-900">

      {orderDetails && (
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-orange-100 uppercase">Total Amount</p>
            <p className="text-3xl font-bold text-white">₹{orderDetails.net_amount}</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-semibold text-orange-100 uppercase">Order #{orderDetails.id}</p>
            <p className="text-sm font-bold text-white mt-1">{orderDetails.status}</p>
          </div>
        </div>
      )}

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-4 p-4 overflow-auto">
        <div className="lg:col-span-2 relative rounded-lg overflow-hidden border border-slate-700 h-[300px] lg:h-auto">
          <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_MAPS_PLACES_API_KEY! as string} libraries={["places"]}>
            <GoogleMap onLoad={onLoad} mapContainerStyle={containerStyle} center={center} zoom={14}>
              {coordinates && (
                <>
                  <Marker
                    position={{
                      lat: coordinates?.restaurant_lat,
                      lng: coordinates?.restaurant_lng,
                    }}
                    label="🍴"
                  />

                  <Marker
                    position={{
                      lat: coordinates?.user_address_lat,
                      lng: coordinates?.user_address_lng,
                    }}
                    label="🏠"
                  />
                  {deliveryAgentLocation && (
                    <Marker
                      position={{
                        lat: deliveryAgentLocation.lat,
                        lng: deliveryAgentLocation.lng,
                      }}
                      label="🚗"
                    />
                  )}

                  {routePath.length > 0 && (
                    <Polyline
                      path={routePath}
                      options={{
                        strokeColor: "#FF6B35",
                        strokeOpacity: 0.9,
                        strokeWeight: 5,
                      }}
                    />
                  )}
                </>
              )}
            </GoogleMap>
          </LoadScript>
        </div>

        <div className="lg:col-span-2 space-y-4 overflow-auto">
          {orderDetails && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-slate-800 border border-slate-700 p-3">
                  <p className="text-xs font-semibold text-slate-400 uppercase">Status</p>
                  <p className="mt-2 text-sm font-bold text-orange-400">{orderDetails.status}</p>
                </div>
                <div className="rounded-lg bg-slate-800 border border-slate-700 p-3">
                  <p className="text-xs font-semibold text-slate-400 uppercase">Payment</p>
                  <p className="mt-2 text-sm font-bold text-green-400">{orderDetails.payment_status}</p>
                </div>
              </div>

              <div className="rounded-lg bg-slate-800 border border-slate-700 p-4">
                <h3 className="text-xs font-bold text-white uppercase mb-3">Breakdown</h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span>Subtotal:</span>
                    <span>₹{orderDetails.total_amount}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Delivery:</span>
                    <span>₹{orderDetails.delivery_charges}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Tax:</span>
                    <span>₹{orderDetails.tax_amount}</span>
                  </div>
                </div>
              </div>


              <div className="rounded-lg bg-slate-800 border border-slate-700 p-4">
                <h3 className="text-xs font-bold text-white uppercase mb-3 flex items-center gap-2">
                  <ChefHat className="h-4 w-4 text-orange-500" />
                  Items ({orderDetails.order_items.length})
                </h3>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {orderDetails.order_items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center text-xs">
                      <span className="text-slate-300 truncate">{item.product_name}</span>
                      <div className="flex items-center gap-2 ml-2">
                        <span className="text-slate-400">×{item.quantity}</span>
                        <span className="font-semibold text-orange-400">₹{item.total_amount}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>


              <div className="rounded-lg bg-slate-800 border border-slate-700 p-4">
                <h3 className="text-xs font-bold text-white uppercase mb-3 flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-orange-500" />
                  Payment
                </h3>
                <div className="space-y-2">
                  {orderDetails.order_payments.map((payment) => (
                    <div key={payment.id} className="flex justify-between items-center text-xs">
                      <span className="text-slate-300">{payment.payment_mode}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">₹{payment.amount}</span>
                        <span className="text-xs font-semibold text-green-400">{payment.payment_status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default DeliveryPage
