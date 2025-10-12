import { parse } from "cookie";
import jwt from "jsonwebtoken";
import type { Server, Socket } from "socket.io";
import prisma from "../prisma/client.js";

interface JwtPayload {
	id: number;
	role: number;
}
declare module "socket.io" {
	interface Socket {
		user?: JwtPayload;
	}
}
function socketLoader(io: Server) {
	const onlineUsers = new Map<number, string[]>();

	function jwtAuthSocket(socket: Socket, next: (err?: Error) => void) {
		try {
			const rawCookie = socket.handshake.headers.cookie;
			if (!rawCookie) return next(new Error("No cookie"));

			const cookies = parse(rawCookie);
			const token = cookies.refreshtoken;
			if (!token) return next(new Error("No token in cookies"));
			const decoded = jwt.verify(
				token,
				process.env.REFRESH_SECRET_KEY as string,
			) as JwtPayload;
			socket.user = decoded;
			next();
		} catch {
			next(new Error("Invalid token"));
		}
	}

	io.use(jwtAuthSocket);

	io.on("connection", (socket) => {
		console.log(` User ${socket.user?.id} connected with socket ${socket.id}`);
		if (socket.user?.id) {
			const existing = onlineUsers.get(socket.user.id) || [];
			onlineUsers.set(socket.user.id, [...existing, socket.id]);
		}
		socket.on("joinRoom", (orderId: string) => {
			const room_name = `room_${orderId}`;
			socket.join(room_name);
		});
		socket.on("OrderId", async (orderId: string) => {
			if (socket.user?.id) {
				try {
					const orderData = await prisma.orders.findUnique({
						where: { id: Number(orderId) },
						select: {
							restaurants: {
								select: {
									address: true,
									lat: true,
									lng: true,
									name: true,
									id: true,
								},
							},
							order_addresses: {
								select: {
									user_addresses: {
										select: {
											address: true,
											lat: true,
											lng: true,
											id: true,
										},
									},
								},
							},
						},
					});
					const restaurant = orderData?.restaurants;

					const userAddress = orderData?.order_addresses?.user_addresses;
					const userSocketId: string[] | [] =
						onlineUsers.get(socket.user.id) || [];
					if (userSocketId.length > 0) {
						userSocketId.forEach((id) => {
							io.to(id).emit("OrderLocations", {
								restaurant_address: restaurant?.address,
								restaurant_lat: restaurant?.lat,
								restaurant_lng: restaurant?.lng,
								restaurant_name: restaurant?.name,
								restaurant_id: restaurant?.id,
								user_address: userAddress?.address,
								user_address_lat: userAddress?.lat,
								user_address_lng: userAddress?.lng,
								user_address_id: userAddress?.id,
								order_id: orderId,
							});
						});
					}
				} catch (e) {
					console.error("Error fetching order:", e);
				}
			}
		});
		socket.on("DeliveryData", async (orderId: string) => {
			if (socket.user?.id && socket.user?.role === 5) {
				try {
					const orderData = await prisma.orders.findUnique({
						where: { id: Number(orderId), user_id: socket.user?.id },
						select: {
							restaurants: {
								select: {
									address: true,
									lat: true,
									lng: true,
									name: true,
									id: true,
								},
							},
							order_addresses: {
								select: {
									user_addresses: {
										select: {
											address: true,
											lat: true,
											lng: true,
											id: true,
										},
									},
								},
							},
						},
					});
					const restaurant = orderData?.restaurants;

					const userAddress = orderData?.order_addresses?.user_addresses;
					const userSocketId: string[] | [] =
						onlineUsers.get(socket.user.id) || [];
					if (userSocketId.length > 0) {
						userSocketId.forEach((id) => {
							io.to(id).emit("OrderLocations", {
								restaurant_address: restaurant?.address,
								restaurant_lat: restaurant?.lat,
								restaurant_lng: restaurant?.lng,
								restaurant_name: restaurant?.name,
								restaurant_id: restaurant?.id,
								user_address: userAddress?.address,
								user_address_lat: userAddress?.lat,
								user_address_lng: userAddress?.lng,
								user_address_id: userAddress?.id,
								order_id: orderId,
							});
						});
					}
				} catch (e) {
					console.error("Error fetching order:", e);
				}
			}
		});
		socket.data.lastEmit = {};
		socket.on("DeliveryAgent", async (data) => {
			if (socket.user?.role !== 5) {
				console.log("wrong role");
				return;
			}
			const last = socket.data.lastEmit || 0;
			const now = Date.now();
			if (now - last < 1000) {
				return;
			}
			socket.data.lastEmit = now;
			const { lat, lng, orderId } = data;
			if (!lat || !lng || !orderId) {
				console.log("Missing coordinates or orderId");
				return;
			}
			// const order = await prisma.orders.findUnique({
			//   where: { id: Number(orderId) },
			//   select: {
			//     delivery_agents: {
			//       select: {
			//         id: true,
			//       },
			//     },
			//   },
			// });
			// if (!order) {
			//   return;
			// }
			const _deliveryLocation = await prisma.delivery_agents.updateMany({
				where: {
					//id: order.delivery_agents?.id ?? 1,
					user_id: socket.user?.id,
				},
				data: { currentLat: lat, currentLng: lng },
			});
			io.to(`room_${orderId}`).emit("DeliveryAgentLocation", {
				lat,
				lng,
				orderId,
			});
		});
		socket.on("disconnect", () => {
			if (socket.user?.id) {
				const existing = onlineUsers.get(socket.user.id) || [];
				const updated = existing.filter((id) => id !== socket.id);
				console.log(`User ${socket.user?.id} disconnected`);
				if (updated.length === 0) {
					onlineUsers.delete(socket.user.id);
				} else {
					onlineUsers.set(socket.user.id, updated);
				}
			}
		});
	});

	return onlineUsers;
}

export default socketLoader;
