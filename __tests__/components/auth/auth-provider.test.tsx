import { render, screen } from "@testing-library/react";
import { AuthProvider } from "@/app/auth/auth-provider";

// Remove the UserContext mock since it doesn't exist in your codebase

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
    // Mock unauthenticated session for this test
    const { useSession } = require("next-auth/react");
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
    // Mock loading session
    const { useSession } = require("next-auth/react");
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