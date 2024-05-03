import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import './config/passport.config';
import userRoutes from './routes/user.routes';
import authRoutes from './routes/auth.routes';
import transactionRoutes from './routes/transaction.routes';
import categoryRoutes from './routes/category.routes';
import spendingLimitRoutes from './routes/spending-limit.routes';

const app = express();
const PORT = process.env.PORT || 1234;

app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(cookieParser());

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/spendingLimits', spendingLimitRoutes)

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});

