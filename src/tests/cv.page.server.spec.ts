import { describe, it, expect } from "vitest";
import { load } from "../routes/cv/+page.server.ts";

describe("CV server load smoke", () => {
    it("returns required CV data", async () => {
        const data = await load({} as Parameters<typeof load>[0]);
        if (!data) throw new Error("Expected load() to return CV page data.");

        expect(data.contact.name).toBeTypeOf("string");
        expect(data.profile).toBeTypeOf("string");
        expect(data.coreSkills.length).toBeGreaterThan(0);
        expect(data.languages.length).toBeGreaterThan(0);
    });
});
