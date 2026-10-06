import { describe, expect, it } from "vitest";
import { readJson } from "../server/http";

describe("bounded JSON request parsing", () => {
  it("reads valid JSON requests", async () => {
    const request = new Request("https://example.com/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating: 5 }),
    });
    await expect(readJson(request)).resolves.toEqual({ rating: 5 });
  });

  it("rejects requests over the body size limit", async () => {
    const request = new Request("https://example.com/api/reviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": "9000",
      },
      body: JSON.stringify({ value: "x".repeat(9000) }),
    });
    await expect(readJson(request)).rejects.toThrow(
      "La solicitud es demasiado grande.",
    );
  });

  it("enforces the body limit when Content-Length is missing", async () => {
    const request = new Request("https://example.com/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value: "x".repeat(9000) }),
    });
    await expect(readJson(request)).rejects.toThrow(
      "La solicitud es demasiado grande.",
    );
  });

  it("requires JSON content type", async () => {
    const request = new Request("https://example.com/api/reviews", {
      method: "POST",
      body: "{}",
    });
    await expect(readJson(request)).rejects.toThrow(
      "Envía los datos como JSON.",
    );
  });
});
