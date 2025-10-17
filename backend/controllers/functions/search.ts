import type { Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { PrismaClient } from '../../generated/prisma/index.js';
import { z } from 'zod';
import { BetterError } from '../../middleware/errorHandler.js';

const prisma = new PrismaClient();

const search = expressAsyncHandler(async (req: Request, res: Response) => {
  const schema = z.object({
    search: z.string(),
  });
  const validation = schema.safeParse(req.query);
  if (!validation.success) {
    throw new BetterError(
      'Search query is required',
      400,
      'SEARCH_QUERY_REQUIRED',
      'Query Error'
    );
  }
  const search = validation.data.search;
  if (!search) {
    const searchRestaurants = await prisma.$queryRawUnsafe<
      {
        id: number;
        name: string;
        city_name: string;
        state_name: string;
        country_name: string;
        rank: number;
      }[]
    >(
      `
        SELECT r.id,r.name,c.city_name,s.state_name,countries.country_name FROM restaurants r
        LEFT JOIN cities c ON r.city_id = c.id
        LEFT JOIN states s ON c.state_id = s.id
        LEFT JOIN countries ON s.country_id = countries.id
        ORDER BY r.name ASC
       
        `
    );
    res.status(200).json(searchRestaurants);
    return;
  }
  const searchRestaurants = await prisma.$queryRawUnsafe<
    {
      id: number;
      name: string;
      city_name: string;
      state_name: string;
      country_name: string;
      rank: number;
    }[]
  >(
    `
    SELECT r.id,r.name,c.city_name,s.state_name,countries.country_name,ts_rank(r.search_vector, plainto_tsquery('english', unaccent($1))) as rank FROM restaurants r
    LEFT JOIN cities c ON r.city_id = c.id
    LEFT JOIN states s ON c.state_id = s.id
    LEFT JOIN countries ON s.country_id = countries.id
    WHERE r.search_vector @@ plainto_tsquery('english', unaccent($1))
    ORDER BY rank DESC
    LIMIT 10 
    `,
    search
  );
  if (searchRestaurants.length === 0) {
    const partialRestaurants = await prisma.$queryRawUnsafe<
      {
        id: number;
        name: string;
        city_name: string;
        state_name: string;
        country_name: string;
        rank: number;
      }[]
    >(
      `
        SELECT r.id,r.name,c.city_name,s.state_name,countries.country_name,ts_rank(r.search_vector, to_tsquery('english', unaccent($1) || ':*')) as rank FROM restaurants r
        LEFT JOIN cities c ON r.city_id = c.id
        LEFT JOIN states s ON c.state_id = s.id
        LEFT JOIN countries ON s.country_id = countries.id
        WHERE r.search_vector @@ to_tsquery('english', unaccent($1) || ':*')
        ORDER BY rank DESC 
        LIMIT 10 
        `,
      search
    );
    res.status(200).json(partialRestaurants);
    return;
  }
  res.status(200).json(searchRestaurants);
});

export default search;
