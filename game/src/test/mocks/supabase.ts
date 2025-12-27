import { vi } from "vitest";
import type { AuthError, Session, User } from "@supabase/supabase-js";

export const mockUser: User = {
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

export const mockSession: Session = {
  access_token: "mock-access-token",
  refresh_token: "mock-refresh-token",
  expires_in: 3600,
  token_type: "bearer",
  user: mockUser,
};

export const mockAuthError: AuthError = {
  name: "AuthError",
  message: "Invalid credentials",
  status: 401,
  code: "invalid_credentials",
};

type AuthChangeCallback = (event: string, session: Session | null) => void;

let authChangeCallback: AuthChangeCallback | null = null;

export const mockSupabaseAuth = {
  getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
  signInAnonymously: vi.fn().mockResolvedValue({
    data: { user: mockUser, session: mockSession },
    error: null,
  }),
  signInWithOAuth: vi.fn().mockResolvedValue({
    data: { url: "https://github.com/login" },
    error: null,
  }),
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

export function simulateAuthStateChange(event: string, session: Session | null) {
  if (authChangeCallback) {
    authChangeCallback(event, session);
  }
}

export const mockSupabase = {
  auth: mockSupabaseAuth,
};

vi.mock("@/lib/supabase", () => ({
  supabase: mockSupabase,
}));
