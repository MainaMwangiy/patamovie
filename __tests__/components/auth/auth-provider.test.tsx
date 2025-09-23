import { render } from "@testing-library/react";
import { screen } from "@testing-library/dom";
import { waitFor } from "@testing-library/react";
import { AuthProvider } from "@/app/auth/auth-provider";
import { jest } from "@jest/globals";

describe("AuthProvider", () => {
  it("renders children correctly", () => {
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