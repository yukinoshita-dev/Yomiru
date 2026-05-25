import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { useTermsConsent } from "./useTermsConsent";

describe("useTermsConsent", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("reports false when terms have not been accepted", async () => {
    const { result } = renderHook(() => useTermsConsent());

    await waitFor(() => {
      expect(result.current.accepted).toBe(false);
    });
  });

  it("stores an accepted timestamp and reports true after accepting", async () => {
    const { result } = renderHook(() => useTermsConsent());

    await waitFor(() => {
      expect(result.current.accepted).toBe(false);
    });

    act(() => {
      result.current.accept();
    });

    expect(result.current.accepted).toBe(true);
    expect(window.localStorage.getItem("yomiru:terms:acceptedAt")).toMatch(
      /^\d{4}-\d{2}-\d{2}T/,
    );
  });

  it("reports true when an accepted timestamp already exists", async () => {
    window.localStorage.setItem("yomiru:terms:acceptedAt", "2026-05-25T00:00:00.000Z");

    const { result } = renderHook(() => useTermsConsent());

    await waitFor(() => {
      expect(result.current.accepted).toBe(true);
    });
  });
});
