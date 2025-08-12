import { PrismaClient } from './generated/prisma';
const express = require('express');
const errorHandler = require('./middleware/errorHandler');
const ControlRestaurants = require('./routes/ControlRestaurants');
const UserRoute = require('./routes/UserControl');
const MenusControl = require('./routes/MenusControl');
const CartControl = require('./routes/CartControl');
const OrderControl = require('./routes/OrderControl');
const ExtraRoutes = require('./routes/extrarouters');
const path = require('path');
import cookieParser from 'cookie-parser';
import cors from 'cors';
const corsOptions: cors.CorsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
};
const app = express();
const port = 5000;
import dotenv from 'dotenv';
app.use('/images', express.static(path.join(__dirname, 'images')));
dotenv.config();
app.use(cookieParser());
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/users', UserRoute);
app.use('/restaurants', ControlRestaurants);

app.use('/restaurants/:restaurantId/menus', MenusControl);

app.use('/cart', CartControl);

app.use('/orders', OrderControl);

app.use('/auths', ExtraRoutes);

app.use(errorHandler);
app.listen(port, () => {
  console.log('server started');
});
