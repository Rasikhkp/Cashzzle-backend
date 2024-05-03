import { Response } from 'express';

const handleServerError = (res: Response, message = 'Internal Server Error', status = 500) => {
  console.error('Error:', message);
  res.status(status).json({ success: false, message });
};

export { handleServerError };
