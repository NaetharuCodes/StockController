import { describe, it, expect, vi, beforeEach } from "vitest";
import { createUser, getAllUsers, getUser } from "./users.controller.js";
import { Role } from "@prisma/client";

vi.mock("../services/prisma.js");

import prisma from "../services/__mocks__/prisma.js";

let mockContext: any;

beforeEach(() => {
  mockContext = {
    req: {
      json: vi.fn(),
    },
    json: vi.fn(),
  };
});

describe("createUser", () => {
  it("should create a user successfully", async () => {
    const userData = {
      name: "test user",
      email: "test@email.com",
      password: "password123",
      role: "USER" as Role,
    };

    mockContext.req.json.mockResolvedValue(userData);

    const createdUser = {
      id: "001",
      ...userData,
      organisationId: "ABC",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    prisma.user.create.mockResolvedValue(createdUser);

    await createUser(mockContext);

    expect(prisma.user.create).toHaveBeenCalledWith({ data: userData });

    expect(mockContext.json).toHaveBeenCalledWith(
      {
        message: "User created successfully",
        user: createdUser,
      },
      201
    );
  });

  it("should handle invalid JSON in requests body", async () => {
    const jsonParserError = new Error("Invalid JSON");
    mockContext.req.json.mockImplementation(() => {
      throw jsonParserError;
    });

    await createUser(mockContext);

    expect(mockContext.json).toHaveBeenCalledWith(
      { error: "Failed to create user" },
      400
    );
  });

  it("should handle any db errors generically", async () => {
    const genericError = new Error("Prisma Error");
    mockContext.req.json.mockImplementation(() => {
      throw genericError;
    });

    await createUser(mockContext);

    expect(mockContext.json).toHaveBeenCalledWith(
      {
        error: "Failed to create user",
      },
      400
    );
  });
});

describe("getAllUsers", () => {
  it("should return all users", async () => {
    const users = [
      {
        id: "001",
        name: "user 01",
        email: "email-1@gmail.com",
        password: "password",
        organisationId: "ABC",
        role: "USER" as Role,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "002",
        name: "user 02",
        email: "email-2@gmail.com",
        password: "password",
        organisationId: "ABC",
        role: "USER" as Role,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    mockContext.req.query = vi.fn().mockReturnValue(null);

    prisma.user.findMany.mockResolvedValue(users as any);

    await getAllUsers(mockContext);

    expect(prisma.user.findMany).toHaveBeenCalledOnce();
    expect(mockContext.json).toHaveBeenCalledWith(
      {
        message: "Users found",
        users: users,
      },
      200
    );
  });

  describe("getAllUsers", () => {
    it("should return all users", async () => {
      const users = [
        {
          id: "001",
          name: "user 01",
          email: "email-1@gmail.com",
          password: "password",
          organisationId: "ABC",
          role: "USER" as Role,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "002",
          name: "user 02",
          email: "email-2@gmail.com",
          password: "password",
          organisationId: "ABC",
          role: "USER" as Role,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockContext.req.query = vi.fn().mockReturnValue(null);

      prisma.user.findMany.mockResolvedValue(users as any);

      await getAllUsers(mockContext);

      expect(prisma.user.findMany).toHaveBeenCalledOnce();
      expect(mockContext.json).toHaveBeenCalledWith(
        {
          message: "Users found",
          users: users,
        },
        200
      );
    });

    it("should handle generic prisma errors", async () => {
      const genericError = new Error("Prisma Error");
      mockContext.req.json.mockImplementation(() => {
        throw genericError;
      });

      await getAllUsers(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith(
        {
          error: "Failed to get user",
        },
        400
      );
    });
  });

  describe("getUser", () => {
    it("should return a user", async () => {
      const userData = {
        name: "test user",
        email: "test@email.com",
        password: "password123",
        role: "USER" as Role,
      };

      mockContext.req.param = vi.fn().mockReturnValue("10");
      prisma.user.findUnique.mockResolvedValue(userData as any);

      await getUser(mockContext);

      expect(prisma.user.findUnique).toHaveBeenCalledOnce();
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: {
          id: "10",
        },
      });
      expect(mockContext.json).toHaveBeenCalledWith(
        {
          message: "User found",
          user: userData,
        },
        200
      );
    });

    it("should handle generic prisma errors", async () => {});
  });
});
