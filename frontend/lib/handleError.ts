import { isAxiosError } from 'axios';

export const handleError = (error: unknown) => {
  if (isAxiosError(error)) {
    if (error.response?.data?.message) {
      return error.response.data.message;
    }

    if (error.request) {
      return 'No response from server. Please check your connection.';
    }

    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }

  return 'An unknown error occurred.';
};
