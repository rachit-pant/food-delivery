import prisma from '../../prisma/client';
import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';

const { BetterError } = require('../../middleware/errorHandler');

const createAddr = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user;
  const city_id = Number(req.body.city_id) || null;
  if(user && city_id) {
    const id = Number(user.id);
    const { address } = req.body;
    if (!address) {
      throw new BetterError( 'Address and City ID are required', 400, 'BAD_REQUEST', 'User Error' );
    }
    if (!id) {
      throw new BetterError('Wrong id', 404, 'WRONG_ID', 'User Error');
    }  

    try {
      const findAddress = await prisma.user_addresses.findMany({
        where: {
          user_id: id
        }
      });
      const newAddress = await prisma.user_addresses.create({
        data: {
          user_id: id,
          address,
          city_id,
          is_default: findAddress.length === 0
        }
      });

      res.status(201).json({
        message: 'Address created successfully',
        data: newAddress,
      });
    } catch (error) {
      throw new BetterError(
        'Address not created',
        500,
        'ADDRESS_NOT_CREATED',
        'User Error'
      );
    }
  }

  res.status(400).json({
    message: 'Validation errors'
  });
  
});

module.exports = createAddr;
