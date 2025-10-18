import type { Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { PrismaClient } from '../../generated/prisma/index.js';
import { z } from 'zod';
import { BetterError } from '../../middleware/errorHandler.js';
const prisma = new PrismaClient();

export const AllCountryFetch = expressAsyncHandler(
  async (_req: Request, res: Response) => {
    const fetchedData = await prisma.countries.findMany();
    res.status(200).json(fetchedData);
  }
);
export const AllStatesCountry = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const schema = z.object({
      id: z.coerce.number(),
    });
    const validation = schema.safeParse(req.params);
    if (!validation.success) {
      throw new BetterError(
        'Invalid country id',
        400,
        'INVALID_COUNTRY_ID',
        'Country Error'
      );
    }
    const fetchedData = await prisma.states.findMany({
      where: {
        country_id: validation.data.id,
      },
    });
    res.status(200).json(fetchedData);
  }
);
export const AllCityStates = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const schema = z.object({
      stateId: z.coerce.number(),
    });
    const validation = schema.safeParse(req.params);
    if (!validation.success) {
      throw new BetterError(
        'Invalid state id',
        400,
        'INVALID_STATE_ID',
        'State Error'
      );
    }
    const fetchedData = await prisma.cities.findMany({
      where: {
        state_id: validation.data.stateId,
      },
    });
    res.status(200).json(fetchedData);
  }
);
