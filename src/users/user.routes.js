import { Router } from "express";
import { getUsers, register, login, updateUser, deleteUser } from "./user.controller.js";

const router = Router();

router.get('/', getUsers);
router.post('/register', register);
router.post('/login', login);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;