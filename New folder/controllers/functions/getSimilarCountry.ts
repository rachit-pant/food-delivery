import expressAsyncHandler from 'express-async-handler';
import { PrismaClient } from '../../generated/prisma';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

const SimilarCountry = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const countryQuery = (req.query.country as string)?.trim();
    if (!countryQuery) {
      const error = new Error('Country query is required');
      (error as any).statusCode = 400;
      throw error;
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
      take: 5,
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
        take: 5,
      });
    }

    if (countries.length === 0) {
      const error = new Error('No country or state found');
      (error as any).statusCode = 400;
      throw error;
    }

    res.status(200).json(countries);
  }
);

module.exports = SimilarCountry;
