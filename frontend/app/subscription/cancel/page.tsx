import React from 'react';
import { XCircle } from 'lucide-react';
const page = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center space-y-6">
        <div className="mx-auto w-24 h-24 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
          <XCircle className="w-16 h-16 text-red-600 dark:text-red-400" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-red-800 dark:text-red-200">
            Payment Failed
          </h1>
          <p className="text-red-700 dark:text-red-300">
            Please try again or contact support.
          </p>
        </div>
      </div>
    </div>
  );
};

export default page;
