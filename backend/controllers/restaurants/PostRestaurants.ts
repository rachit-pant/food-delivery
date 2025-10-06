import { PrismaClient } from '../../generated/prisma';
import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
const prisma = new PrismaClient();

const AddResta = asyncHandler(async (req: Request, res: Response) => {
  const UserId = req.user?.id;
  const { name, address } = req.body;
  const city_id = req.body.city_id;
  const image = req.file?.filename;
  const timingsDefault = JSON.parse(req.body.timings);
  const timings = timingsDefault.map((t: any) => ({
    week_day: t.week_day,
    start_time: `1970-01-01T${t.start_time}:00Z`,
    end_time: `1970-01-01T${t.end_time}:00Z`,
  }));
  const latitude = parseFloat(req.body.latitude);
  const longitude = parseFloat(req.body.longitude);
  if (!latitude || !longitude) {
    throw new Error('Latitude and longitude are required');
  }
  const AddResta = await prisma.restaurants.create({
    data: {
      user_id: UserId,
      name,
      address,
      city_id: Number(city_id),
      rating: 4,
      status: 'active',
      imageurl: `/images/${image}`,
      lat: latitude,
      lng: longitude,
    },
    select: {
      id: true,
    },
  });
  const AddRestaTimings = await prisma.restaurant_timings.createMany({
    data: timings.map((t: any) => ({
      restaurant_id: AddResta.id,
      ...t,
    })),
  });
  if (!AddResta) {
    const error = new Error('server error');
    (error as any).statusCode = 500;
    throw error;
  }
  res.status(200).json(AddResta);
});

module.exports = AddResta;
