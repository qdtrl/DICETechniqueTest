import { generateRandomId } from "../functions/generate_random_id.func";

describe("generateRandomId", () => {
  it("should generate a random ID with 7 characters", () => {
    const id = generateRandomId();
    expect(id).toHaveLength(7);
  });

  it("should generate a random ID consisting of uppercase letters and numbers", () => {
    const id = generateRandomId();
    const regex = /^[A-Z0-9]+$/;
    expect(regex.test(id)).toBe(true);
  });
});
