import { signupService } from '../services/userService.js';

export async function signup(req, res) {
  try {
    const user = await signupService(req.body);
    return res.status(201).json({
      success: true,
      message: 'user created successfully',
      data: user
    });
  } catch (error) {
    console.log('User controller error: ', error);
    return res.status(500).json({
      success: false,
      message: 'failed to create a user'
    });
  }
}
