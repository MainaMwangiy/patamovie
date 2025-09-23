import "@testing-library/jest-dom";

// Mock environment variables
process.env.NEXT_PUBLIC_TMDB_API_KEY = "test-api-key";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => "/",
}));

// Mock next-auth/react
jest.mock("next-auth/react", () => ({
  useSession: jest.fn(() => ({
    data: {
      user: {
        id: "test-user-id",
        name: "Test User",
        email: "test@example.com",
      },
    },
    status: "authenticated",
  })),
  SessionProvider: ({ children }: { children: React.ReactNode }) => children,
}));

// Global fetch mock setup (will be overridden in individual tests)
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
    status: 200,
    statusText: "OK",
  })
) as jest.Mock;

// Suppress console warnings during tests
const originalWarn = console.warn;
beforeAll(() => {
  console.warn = (...args) => {
    if (
      typeof args[0] === "string" &&
      args[0].includes("Warning: ReactDOM.render is deprecated")
    ) {
      return;
    }
    originalWarn.call(console, ...args);
  };
});

afterAll(() => {
  console.warn = originalWarn;
});