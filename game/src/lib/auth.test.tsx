import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { AuthError, Session, User } from "@supabase/supabase-js";

// Hoist mock data so it's available when vi.mock runs
const { mockSupabaseAuth, mockUser, mockSession, mockAuthError, simulateAuthStateChange } = vi
  .hoisted(() => {
    type AuthChangeCallback = (event: string, session: Session | null) => void;
    let authChangeCallback: AuthChangeCallback | null = null;

    const mockUser: User = {
      id: "test-user-id",
      app_metadata: {},
      user_metadata: {
        full_name: "Test User",
        avatar_url: "https://example.com/avatar.jpg",
      },
      aud: "authenticated",
      created_at: "2024-01-01T00:00:00.000Z",
      is_anonymous: false,
    };

    const mockSession: Session = {
      access_token: "mock-access-token",
      refresh_token: "mock-refresh-token",
      expires_in: 3600,
      token_type: "bearer",
      user: mockUser,
    };

    const mockAuthError: AuthError = {
      name: "AuthError",
      message: "Invalid credentials",
      status: 401,
      code: "invalid_credentials",
    };

    const mockSupabaseAuth = {
      getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
      signInAnonymously: vi
        .fn()
        .mockResolvedValue({ data: { user: mockUser, session: mockSession }, error: null }),
      signInWithOAuth: vi
        .fn()
        .mockResolvedValue({ data: { url: "https://github.com/login" }, error: null }),
      signOut: vi.fn().mockResolvedValue({ error: null }),
      onAuthStateChange: vi.fn((callback: AuthChangeCallback) => {
        authChangeCallback = callback;
        return {
          data: {
            subscription: {
              unsubscribe: vi.fn(),
            },
          },
        };
      }),
    };

    function simulateAuthStateChange(event: string, session: Session | null) {
      if (authChangeCallback) {
        authChangeCallback(event, session);
      }
    }

    return { mockSupabaseAuth, mockUser, mockSession, mockAuthError, simulateAuthStateChange };
  });

// Mock supabase
vi.mock("./supabase", () => ({
  supabase: {
    auth: mockSupabaseAuth,
  },
}));

// Mock sonner
vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

import { AuthProvider, useAuth } from "./auth";

function TestConsumer() {
  const { user, loading, displayName, signInAnonymously, signOut } = useAuth();

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div data-testid="user-status">{user ? "authenticated" : "unauthenticated"}</div>
      <div data-testid="display-name">{displayName}</div>
      <button onClick={() => signInAnonymously()}>Sign In</button>
      <button onClick={() => signOut()}>Sign Out</button>
    </div>
  );
}

describe("AuthProvider", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Re-initialize mocks with default values after clearing
    mockSupabaseAuth.getSession.mockResolvedValue({ data: { session: null }, error: null });
    mockSupabaseAuth.signInAnonymously.mockResolvedValue({
      data: { user: mockUser, session: mockSession },
      error: null,
    });
    mockSupabaseAuth.signInWithOAuth.mockResolvedValue({
      data: { url: "https://github.com/login" },
      error: null,
    });
    mockSupabaseAuth.signOut.mockResolvedValue({ error: null });
  });

  it("renders children when loaded", async () => {
    render(
      <AuthProvider>
        <div data-testid="child">Child content</div>
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("child")).toBeInTheDocument();
    });
  });

  it("provides null user when not authenticated", async () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("user-status")).toHaveTextContent("unauthenticated");
    });
  });

  it("provides user data when authenticated", async () => {
    mockSupabaseAuth.getSession.mockResolvedValue({
      data: { session: mockSession },
      error: null,
    });

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("user-status")).toHaveTextContent("authenticated");
      expect(screen.getByTestId("display-name")).toHaveTextContent("Test User");
    });
  });

  it("signInAnonymously calls supabase and returns result", async () => {
    const user = userEvent.setup();

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText("Sign In")).toBeInTheDocument();
    });

    await user.click(screen.getByText("Sign In"));

    expect(mockSupabaseAuth.signInAnonymously).toHaveBeenCalled();
  });

  it("signInAnonymously shows error toast on failure", async () => {
    const { toast } = await import("sonner");
    const user = userEvent.setup();

    mockSupabaseAuth.signInAnonymously.mockResolvedValue({
      data: { user: null, session: null },
      error: mockAuthError,
    });

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText("Sign In")).toBeInTheDocument();
    });

    await user.click(screen.getByText("Sign In"));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Invalid credentials");
    });
  });

  it("signOut clears auth state via onAuthStateChange", async () => {
    const user = userEvent.setup();

    mockSupabaseAuth.getSession.mockResolvedValue({
      data: { session: mockSession },
      error: null,
    });

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("user-status")).toHaveTextContent("authenticated");
    });

    await user.click(screen.getByText("Sign Out"));

    expect(mockSupabaseAuth.signOut).toHaveBeenCalled();

    // Simulate auth state change after sign out
    act(() => {
      simulateAuthStateChange("SIGNED_OUT", null);
    });

    await waitFor(() => {
      expect(screen.getByTestId("user-status")).toHaveTextContent("unauthenticated");
    });
  });
});

describe("useAuth", () => {
  it("throws when used outside AuthProvider", () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => {
      render(<TestConsumer />);
    }).toThrow("useAuth must be used within an AuthProvider");

    consoleError.mockRestore();
  });
});
