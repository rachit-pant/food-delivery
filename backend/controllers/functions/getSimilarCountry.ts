import type { Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { PrismaClient } from '../../generated/prisma/index.js';
import { BetterError } from '../../middleware/errorHandler.js';
import { z } from 'zod';

const prisma = new PrismaClient();

const SimilarCountry = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const schema = z.object({
      country: z.string(),
    });
    const validation = schema.safeParse(req.query);
    if (!validation.success) {
      throw new BetterError(
        'Country query is required',
        400,
        'COUNTRY_QUERY_REQUIRED',
        'Query Error'
      );
    }
    const countryQuery = validation.data.country.trim();
    if (!countryQuery) {
      throw new BetterError(
        'Country query is required',
        400,
        'COUNTRY_QUERY_REQUIRED',
        'Query Error'
      );
    }

    let countries = await prisma.countries.findMany({
      where: {
        country_name: {
          contains: countryQuery,
          mode: 'insensitive',
        },
      },
      include: {
        states: true,
      },
    });

    if (countries.length === 0) {
      countries = await prisma.countries.findMany({
        where: {
          states: {
            some: {
              state_name: {
                contains: countryQuery,
                mode: 'insensitive',
              },
            },
          },
        },
        include: {
          states: {
            where: {
              state_name: {
                contains: countryQuery,
                mode: 'insensitive',
              },
            },
          },
        },
      });
    }

    if (countries.length === 0) {
      throw new BetterError(
        'No country or state found',
        400,
        'NO_COUNTRY_OR_STATE_FOUND',
        'Query Error'
      );
    }

    res.status(200).json(countries);
  }
);

export default SimilarCountry;
