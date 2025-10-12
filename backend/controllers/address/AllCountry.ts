import type { Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { PrismaClient } from '../../generated/prisma/index.js';

const prisma = new PrismaClient();

export const AllCountryFetch = expressAsyncHandler(
  async (_req: Request, res: Response) => {
    const fetchedData = await prisma.countries.findMany();
    res.status(200).json(fetchedData);
  }
);
export const AllStatesCountry = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const countryId = Number(req.params?.id);
    if (!countryId) {
      const error = new Error('no coutnry id');
      (error as any).statusCode = 400;
      throw error;
    }
    const fetchedData = await prisma.states.findMany({
      where: {
        country_id: countryId,
      },
    });
    res.status(200).json(fetchedData);
  }
);
export const AllCityStates = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const stateId = Number(req.params?.stateId);
    if (!stateId) {
      const error = new Error('no state id');
      (error as any).statusCode = 400;
      throw error;
    }
    const fetchedData = await prisma.cities.findMany({
      where: {
        state_id: stateId,
      },
    });
    res.status(200).json(fetchedData);
  }
);
