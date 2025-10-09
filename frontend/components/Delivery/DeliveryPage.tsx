'use client';
import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  GoogleMap,
  Marker,
  Polyline,
  LoadScript,
} from '@react-google-maps/api';
import { api } from '@/api/api';
import { getSocket } from '@/lib/sockets';
export interface Order {
  id: number;
  user_id: number;
  restaurant_id: number;
  total_amount: number;
  discount_amount: number;
  delivery_charges: number;
  tax_amount: number;
  net_amount: number;
  delivery_agent_id: number;
  payment_status: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  order_items: OrderItem[];
  order_payments: OrderPayment[];
}

export interface OrderItem {
  id: number;
  order_id: number;
  menu_id: number;
  variant_id: number;
  price: number;
  quantity: number;
  total_amount: number;
  product_name: string;
}

export interface OrderPayment {
  id: number;
  order_id: number;
  amount: number;
  payment_mode: string;
  payment_status: string;
}
interface Coordinates {
  restaurant_address: string;
  restaurant_lat: number;
  restaurant_lng: number;
  restaurant_name: string;
  restaurant_id: number;
  user_address: string;
  user_address_lat: number;
  user_address_lng: number;
  user_address_id: number;
  order_id: number;
}
interface DeliveryAgentLocation {
  lat: number;
  lng: number;
  orderId: number;
}

const containerStyle = {
  width: '100%',
  height: '100%',
};

const DeliveryPage = ({ orderId }: { orderId: string }) => {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [orderDetails, setOrderDetails] = useState<Order | null>(null);
  const [routePath, setRoutePath] = useState<google.maps.LatLngLiteral[]>([]);
  const [deliveryAgentLocation, setDeliveryAgentLocation] =
    useState<DeliveryAgentLocation | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);

  useEffect(() => {
    const socket = getSocket();
    socket.emit('OrderId', orderId);
    socket.emit('joinRoom', orderId);
    const handleOrderLocations = (data: Coordinates) => {
      console.log(' OrderLocations received');
      setCoordinates(data);
      console.log('OrderLocations data:', data);
    };
    socket.on('OrderLocations', handleOrderLocations);
    socket.on('DeliveryAgentLocation', (data: DeliveryAgentLocation) => {
      setDeliveryAgentLocation(data);
    });
    return () => {
      socket.off('OrderLocations', handleOrderLocations);
    };
  }, [orderId]);

  useEffect(() => {
    if (!coordinates?.order_id) return;
    const fetchOrderDetails = async () => {
      try {
        const { data } = await api.get(`/orders/info/${coordinates.order_id}`);
        setOrderDetails(data);
        console.log('OrderDetails data:', data);
      } catch (err) {
        console.error('Failed to fetch order details:', err);
      }
    };
    fetchOrderDetails();
  }, [coordinates?.order_id]);

  const onLoad = useCallback(
    (map: google.maps.Map) => {
      mapRef.current = map;
      if (coordinates) {
        calculateRoute(coordinates);
      }
    },
    [coordinates]
  );
  const calculateRoute = (coords: Coordinates) => {
    if (!window.google || !mapRef.current) return;

    const {
      restaurant_lat,
      restaurant_lng,
      user_address_lat,
      user_address_lng,
    } = coords;
    if (
      restaurant_lat == null ||
      restaurant_lng == null ||
      user_address_lat == null ||
      user_address_lng == null
    )
      return;

    const directionsService = new google.maps.DirectionsService();
    directionsService.route(
      {
        origin: { lat: restaurant_lat, lng: restaurant_lng },
        destination: { lat: user_address_lat, lng: user_address_lng },
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === 'OK' && result?.routes[0]) {
          const points = result.routes[0].overview_path.map((p) => ({
            lat: p.lat(),
            lng: p.lng(),
          }));
          setRoutePath(points);
        } else {
          console.error('Route request failed:', status);
        }
      }
    );
  };
  const center = coordinates
    ? {
        lat: (coordinates.restaurant_lat + coordinates.user_address_lat) / 2,
        lng: (coordinates.restaurant_lng + coordinates.user_address_lng) / 2,
      }
    : { lat: 20.5937, lng: 78.9629 };
  useEffect(() => {
    if (coordinates && mapRef.current) {
      calculateRoute(coordinates);
    }
  }, [coordinates]);

  return (
    <div className="h-screen w-full grid grid-cols-1 lg:grid-cols-2">
      <div className="relative h-[50vh] lg:h-full">
        <LoadScript
          googleMapsApiKey={
            process.env.NEXT_PUBLIC_MAPS_PLACES_API_KEY! as string
          }
          libraries={['places']}
        >
          <GoogleMap
            onLoad={onLoad}
            mapContainerStyle={containerStyle}
            center={center}
            zoom={14}
          >
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
                      strokeColor: '#1D4ED8',
                      strokeOpacity: 0.8,
                      strokeWeight: 5,
                    }}
                  />
                )}
              </>
            )}
          </GoogleMap>
        </LoadScript>
      </div>
      <div className="p-4 bg-gray-100 overflow-auto">
        {orderDetails && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Order #{orderDetails.id}</h2>
            <p>
              <strong>Status:</strong> {orderDetails.status}
            </p>
            <p>
              <strong>Payment:</strong> {orderDetails.payment_status}
            </p>
            <p>
              <strong>Total Amount:</strong> ₹{orderDetails.total_amount}
            </p>
            <p>
              <strong>Delivery Charges:</strong> ₹
              {orderDetails.delivery_charges}
            </p>

            <h3 className="font-semibold mt-4">Items</h3>
            <div className="space-y-2">
              {orderDetails.order_items.map((item) => (
                <div
                  key={item.id}
                  className="border p-2 rounded flex justify-between items-center"
                >
                  <span>
                    {item.product_name} x {item.quantity}
                  </span>
                  <span>₹{item.total_amount}</span>
                </div>
              ))}
            </div>

            <h3 className="font-semibold mt-4">Payments</h3>
            <div className="space-y-2">
              {orderDetails.order_payments.map((payment) => (
                <div key={payment.id} className="flex justify-between">
                  <span>{payment.payment_mode}</span>
                  <span>
                    ₹{payment.amount} ({payment.payment_status})
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryPage;
