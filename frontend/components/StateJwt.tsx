'use client';
import React from 'react';
import { useAppDispatch } from '@/lib/hooks';
import { setRole } from '@/lib/roleMiddlewareSlice';

const StateJwt = ({ role }: { role: number }) => {
  const dispatch = useAppDispatch();
  dispatch(setRole(role));
  return null;
};

export default StateJwt;
