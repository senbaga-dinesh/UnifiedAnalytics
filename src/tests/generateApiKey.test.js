import { generateApiKey } from "../utils/generateApiKey.js";

describe("Utility: generateApiKey", () => {
  test("should return a string", () => {
    const key = generateApiKey();
    expect(typeof key).toBe("string");
  });

  test("should return a 64-character hex string", () => {
    const key = generateApiKey();
    expect(key.length).toBe(64);
  });

  test("should generate unique keys each time", () => {
    const key1 = generateApiKey();
    const key2 = generateApiKey();
    expect(key1).not.toBe(key2);
  });
});
