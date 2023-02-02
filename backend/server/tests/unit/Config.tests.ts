import config from "../../src/config";

describe("Config tests", () => {
    it("should be able to load config", () => {
        expect(config).not.toBeUndefined();
    });

    it("should be able to load config.port", () => {
        expect(config.port).not.toBeUndefined();
    });

    it("should be able to load config.endpoint", () => {
        expect(config.endpoint).not.toBeUndefined();
    });

    it("should be able to load config.prefix", () => {
        expect(config.prefix).not.toBeUndefined();
    });

    it("should be able to load config.port as string", () => {
        expect(typeof config.port).toBe("string");
    });

    it("should be able to load config.endpoint as string", () => {
        expect(typeof config.endpoint).toBe("string");
    });

    it("should be able to load config.prefix as string", () => {
        expect(typeof config.prefix).toBe("string");
    });
});
