import { render, screen } from "@testing-library/react";
import { AuthProvider } from "@/app/auth/auth-provider";
import { jest } from "@jest/globals";

// Mock next-auth/react properly
jest.mock("next-auth/react", () => ({
  useSession: jest.fn(() => ({
    data: null,
    status: "unauthenticated",
  })),
}));

// Type the mock for better type safety
interface MockedNextAuth {
  useSession: jest.MockedFunction<() => {
    data: any;
    status: string;
  }>;
}

describe("AuthProvider", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders children correctly", () => {
    render(
      <AuthProvider>
        <div>Test Child</div>
      </AuthProvider>
    );
    
    expect(screen.getByText("Test Child")).toBeInTheDocument();
  });

  it("handles unauthenticated session", () => {
    // Type assertion to fix the TypeScript error
    const { useSession } = jest.requireMock("next-auth/react") as MockedNextAuth;
    useSession.mockReturnValueOnce({
      data: null,
      status: "unauthenticated",
    });

    render(
      <AuthProvider>
        <div>Test Child</div>
      </AuthProvider>
    );

    expect(screen.getByText("Test Child")).toBeInTheDocument();
  });

  it("handles loading session", () => {
    // Type assertion to fix the TypeScript error
    const { useSession } = jest.requireMock("next-auth/react") as MockedNextAuth;
    useSession.mockReturnValueOnce({
      data: null,
      status: "loading",
    });

    render(
      <AuthProvider>
        <div>Test Child</div>
      </AuthProvider>
    );

    expect(screen.getByText("Test Child")).toBeInTheDocument();
  });

  it("matches snapshot", () => {
    const { container } = render(
      <AuthProvider>
        <div>Test Child</div>
      </AuthProvider>
    );
    expect(container).toMatchSnapshot();
  });
});