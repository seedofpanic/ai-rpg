import "@testing-library/jest-dom";
import { vi } from "vitest";

Object.defineProperty(window, "location", {
  value: {
    reload: () => {},
  },
});
vi.spyOn(window, "alert").mockImplementation(() => {});
