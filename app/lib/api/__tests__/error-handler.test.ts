// app/lib/api/__tests__/error-handler.test.ts
import { describe, it, expect, vi } from "vitest";
import {
  withErrorHandler,
  errorResponse,
  successResponse,
  validateFields,
} from "../error-handler";
import { NextRequest } from "next/server";

describe("API Error Handler", () => {
  describe("withErrorHandler", () => {
    it("should execute handler successfully", async () => {
      const mockHandler = vi.fn(async () => Response.json({ success: true }));
      const wrapped = withErrorHandler(mockHandler);
      const req = new Request("http://localhost/api/test") as NextRequest;

      const response = await wrapped(req);
      const data = await response.json();

      expect(mockHandler).toHaveBeenCalledWith(req);
      expect(data).toEqual({ success: true });
    });

    it("should catch and handle errors", async () => {
      const mockHandler = vi.fn(async () => {
        throw new Error("Test error");
      });
      const wrapped = withErrorHandler(mockHandler);
      const req = new Request("http://localhost/api/test") as NextRequest;

      const response = await wrapped(req);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({ error: "Test error" });
    });
  });

  describe("errorResponse", () => {
    it("should create error response with default status", async () => {
      const response = errorResponse("Something went wrong");

      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data).toEqual({ error: "Something went wrong" });
    });

    it("should create error response with custom status", async () => {
      const response = errorResponse("Bad request", 400);

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data).toEqual({ error: "Bad request" });
    });

    it("should include details when provided", async () => {
      const response = errorResponse("Error", 500, "Detailed info");

      const data = await response.json();
      expect(data).toEqual({
        error: "Error",
        details: "Detailed info",
      });
    });
  });

  describe("successResponse", () => {
    it("should create success response with default status", async () => {
      const data = { id: "123", name: "Test" };
      const response = successResponse(data);

      expect(response.status).toBe(200);
      const result = await response.json();
      expect(result).toEqual(data);
    });

    it("should create success response with custom status", async () => {
      const data = { created: true };
      const response = successResponse(data, 201);

      expect(response.status).toBe(201);
      const result = await response.json();
      expect(result).toEqual(data);
    });
  });

  describe("validateFields", () => {
    it("should return null when all fields present", () => {
      const obj = { field1: "value1", field2: "value2" };
      const result = validateFields(obj, ["field1", "field2"] as const);

      expect(result).toBeNull();
    });

    it("should return error when fields missing", async () => {
      const obj = { field1: "value1" };
      const result = validateFields(obj, ["field1", "field2"] as const);

      expect(result).not.toBeNull();
      expect(result?.status).toBe(400);
      const data = await result?.json();
      expect(data.error).toContain("field2");
    });

    it("should handle multiple missing fields", async () => {
      const obj: Record<string, string> = {};
      const result = validateFields(obj, ["field1", "field2", "field3"] as const);

      expect(result).not.toBeNull();
      const data = await result?.json();
      expect(data.error).toContain("field1");
      expect(data.error).toContain("field2");
      expect(data.error).toContain("field3");
    });
  });
});
