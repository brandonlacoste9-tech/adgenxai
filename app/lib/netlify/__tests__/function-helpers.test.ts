// netlify/functions/lib/__tests__/function-helpers.test.ts
import { describe, it, expect } from "vitest";
import {
  validateHttpMethod,
  parseRequestBody,
  validateRequiredFields,
  validateEnvVars,
  successResponse,
  errorResponse,
} from "../function-helpers";
import { HandlerEvent } from "@netlify/functions";

describe("Function Helpers", () => {
  describe("validateHttpMethod", () => {
    it("should return null for matching method", () => {
      const event = { httpMethod: "POST" } as HandlerEvent;
      const result = validateHttpMethod(event, "POST");
      expect(result).toBeNull();
    });

    it("should return error response for non-matching method", () => {
      const event = { httpMethod: "GET" } as HandlerEvent;
      const result = validateHttpMethod(event, "POST");
      expect(result).not.toBeNull();
      expect(result?.statusCode).toBe(405);
      expect(JSON.parse(result?.body || "{}")).toEqual({
        error: "Method not allowed. Use POST.",
      });
    });
  });

  describe("parseRequestBody", () => {
    it("should parse valid JSON body", () => {
      const event = {
        body: JSON.stringify({ key: "value" }),
      } as HandlerEvent;
      const result = parseRequestBody(event);
      expect(result.body).toEqual({ key: "value" });
      expect(result.error).toBeUndefined();
    });

    it("should handle empty body", () => {
      const event = { body: "" } as HandlerEvent;
      const result = parseRequestBody(event);
      expect(result.body).toEqual({});
      expect(result.error).toBeUndefined();
    });

    it("should return error for invalid JSON", () => {
      const event = { body: "invalid json" } as HandlerEvent;
      const result = parseRequestBody(event);
      expect(result.body).toBeUndefined();
      expect(result.error).not.toBeUndefined();
      expect(result.error?.statusCode).toBe(400);
    });
  });

  describe("validateRequiredFields", () => {
    it("should return null when all fields present", () => {
      const body = { field1: "value1", field2: "value2" };
      const result = validateRequiredFields(body, ["field1", "field2"] as const);
      expect(result).toBeNull();
    });

    it("should return error when fields missing", () => {
      const body = { field1: "value1" };
      const result = validateRequiredFields(body, ["field1", "field2"] as const);
      expect(result).not.toBeNull();
      expect(result?.statusCode).toBe(400);
      expect(JSON.parse(result?.body || "{}").error).toContain("field2");
    });

    it("should handle multiple missing fields", () => {
      const body: Record<string, string> = {};
      const result = validateRequiredFields(body, ["field1", "field2"] as const);
      expect(result).not.toBeNull();
      const error = JSON.parse(result?.body || "{}");
      expect(error.error).toContain("field1");
      expect(error.error).toContain("field2");
    });
  });

  describe("validateEnvVars", () => {
    it("should return null when all vars present", () => {
      const vars = { VAR1: "value1", VAR2: "value2" };
      const result = validateEnvVars(vars, "TestService");
      expect(result).toBeNull();
    });

    it("should return error when vars missing", () => {
      const vars = { VAR1: "value1", VAR2: undefined };
      const result = validateEnvVars(vars, "TestService");
      expect(result).not.toBeNull();
      expect(result?.statusCode).toBe(500);
      const error = JSON.parse(result?.body || "{}");
      expect(error.error).toContain("TestService");
      expect(error.error).toContain("VAR2");
    });
  });

  describe("successResponse", () => {
    it("should create success response with default status", () => {
      const data = { success: true, id: "123" };
      const result = successResponse(data);
      expect(result.statusCode).toBe(200);
      expect(result.headers?.["Content-Type"]).toBe("application/json");
      expect(JSON.parse(result.body!)).toEqual(data);
    });

    it("should create success response with custom status", () => {
      const data = { created: true };
      const result = successResponse(data, 201);
      expect(result.statusCode).toBe(201);
    });
  });

  describe("errorResponse", () => {
    it("should create error response with message only", () => {
      const result = errorResponse("Something went wrong");
      expect(result.statusCode).toBe(500);
      expect(JSON.parse(result.body!)).toEqual({
        error: "Something went wrong",
      });
    });

    it("should include details when provided", () => {
      const result = errorResponse("Error", "Detailed message", 400);
      expect(result.statusCode).toBe(400);
      const body = JSON.parse(result.body!);
      expect(body.error).toBe("Error");
      expect(body.details).toBe("Detailed message");
    });
  });
});
