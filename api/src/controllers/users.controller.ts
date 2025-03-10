import type { Context } from "hono";
import prisma from "../services/prisma.js";

export const createUser = async (c: Context) => {
  try {
    const body = await c.req.json();

    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        password: body.password,
        role: body.role,
      },
    });

    return c.json({ message: "User created successfully", user }, 201);
  } catch (error) {
    console.error("Error creating user", error);
    return c.json({ error: "Failed to create user" }, 400);
  }
};

export const getAllUsers = async (c: Context) => {
  console.log("getting users");

  try {
    const users = await prisma.user.findMany();

    return c.json({ message: "Users found", users }, 200);
  } catch (error) {
    console.error("Error getting user", error);
    return c.json({ error: "Failed to get user" }, 400);
  }
};
