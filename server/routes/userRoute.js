import express from 'express';
const router = express.Router();
import {
    authUser,
    getUserProfile,
    registerUser,
    logoutUser,
    getUserById,
    updateUser,
    updateUserProfile,
    deleteUser,
    getUsers,
} from '../controllers/userController.js';
import { auth, admin } from '../middleware/authMiddleware.js';

router.route('/').get(auth, admin,getUsers).post(registerUser);
router.post('/login',authUser);
router.post('/logout',logoutUser);
router.route('/profile').get(auth, getUserProfile).put(auth, updateUserProfile);
router.route('/:id').delete(auth, admin, deleteUser).get(auth, admin, getUserById).put(auth, admin, updateUser);

export default router;