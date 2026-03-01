import { describe, it, expect } from "vitest";
import { load } from "../routes/+page.server.ts";

describe("Home server load smoke", () => {
    it("returns required top-level data", async () => {
        const data = await load({} as Parameters<typeof load>[0]);
        if (!data) throw new Error("Expected load() to return page data.");

        expect(data.profile).toBeTypeOf("string");
        expect(data.skills.length).toBeGreaterThan(0);
        expect(data.projects.length).toBeGreaterThan(0);
        expect(data.experience.length).toBeGreaterThan(0);
        expect(data.education.length).toBeGreaterThan(0);
        expect(data.languages.length).toBeGreaterThan(0);
    });
});
