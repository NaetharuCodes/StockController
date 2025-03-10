import { Hono } from "hono";
import { createUser, getAllUsers } from "../controllers/users.controller.js";

const userRoutes = new Hono();

userRoutes.post("/", createUser);
userRoutes.get("/", getAllUsers);

export default userRoutes;
