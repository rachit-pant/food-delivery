const express = require('express');
const { createServer } = require('http');
const { errorHandler } = require('./middleware/errorHandler');
const ControlRestaurants = require('./routes/ControlRestaurants');
const UserRoute = require('./routes/UserControl');
const MenusControl = require('./routes/MenusControl');
const CartControl = require('./routes/CartControl');
const OrderControl = require('./routes/OrderControl');
const ExtraRoutes = require('./routes/extrarouters');
const WebAddress = require('./routes/WebAddress');
const AdditionalRoutes = require('./routes/additionalRoutes');
const path = require('path');
const StripeWebhooks = require('./routes/StripeWebhooks');
const Franchise = require('./routes/franchise');
const delivery = require('./routes/delivery');
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { Server } from 'socket.io';
const socketloader = require('./sockets/index');
dotenv.config();
const corsOptions: cors.CorsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
};
const app = express();
const port = 5000;
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  },
});
const onlineUsers = socketloader(io);
app.set('io', io);
app.set('onlineUsers', onlineUsers);
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use(cookieParser());
app.use(cors(corsOptions));

app.use('/stripe', StripeWebhooks);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/users', UserRoute);
app.use('/restaurants', ControlRestaurants);

app.use('/restaurants/:restaurantId/menus', MenusControl);

app.use('/cart', CartControl);

app.use('/orders', OrderControl);

app.use('/auths', ExtraRoutes);

app.use('/franchise', Franchise);

app.use('/address', WebAddress);

app.use('/extra', AdditionalRoutes);

app.use('/delivery', delivery);

app.use(errorHandler);
httpServer.listen(port, () => {
  console.log(`server started on port ${port}`);
});
