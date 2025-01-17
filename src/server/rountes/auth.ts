import express, { Request, Response } from 'express';
import { dbOperations } from '../db/operations';

interface LoginRequest {
  email: string;
  password: string;
}

interface SignupRequest extends LoginRequest {
  username: string;
  fullName: string;
}

const router = express.Router();

router.post('/login', async (req: Request<{}, any, LoginRequest>, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await dbOperations.getUser(email, password);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    res.json({ user });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/signup', async (req: Request<{}, any, SignupRequest>, res: Response) => {
  const { email, password, username, fullName } = req.body;
  try {
    const user = await dbOperations.createUser({
      email,
      password,
      username,
      fullName
    });
    res.json({ user });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export { router };