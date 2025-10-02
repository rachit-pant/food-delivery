'use client';
import React, { useEffect } from 'react';
import AddStaff from './AddStaff';
import { api } from '@/api/api';
const ManageStaff = () => {
  useEffect(() => {
    const fetchStaff = async () => {
      const res = await api.get('/franchise/getAllStaff');
      console.log('staff', res.data);
    };
    fetchStaff();
  }, []);
  return (
    <div>
      <AddStaff />
    </div>
  );
};

export default ManageStaff;
