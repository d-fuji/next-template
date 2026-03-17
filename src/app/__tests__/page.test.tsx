import { describe, it, expect, beforeAll, afterEach, afterAll } from "vitest";
import { render, screen, within } from "@/lib/test-utils";
import { server } from "@/mocks/server";
import Home from "../page";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("Home", () => {
  it("should render the project name and description", () => {
    render(<Home />);

    expect(screen.getByTestId("project-name")).toHaveTextContent("{{PROJECT_NAME}}");
    expect(screen.getByTestId("project-description")).toHaveTextContent("{{PROJECT_DESCRIPTION}}");
  });

  it("should render the Claude Code branding", () => {
    render(<Home />);

    expect(screen.getByText(/Built for Claude Code/)).toBeInTheDocument();
  });

  it("should render the terminal", () => {
    render(<Home />);

    expect(screen.getByTestId("terminal")).toBeInTheDocument();
  });

  it("should render three feature columns", () => {
    render(<Home />);

    const features = screen.getByTestId("features");
    expect(within(features).getByText("Claude Code Skills")).toBeInTheDocument();
    expect(within(features).getByText("Spec-First + TDD")).toBeInTheDocument();
    expect(within(features).getByText("全部入り")).toBeInTheDocument();
  });

  it("should show Claude Code skills in the features", () => {
    render(<Home />);

    const features = screen.getByTestId("features");
    expect(within(features).getByText("/tdd")).toBeInTheDocument();
    expect(within(features).getByText("/add-field")).toBeInTheDocument();
    expect(within(features).getByText("/db-migrate")).toBeInTheDocument();
  });

  it("should render the edit hint in the footer", () => {
    render(<Home />);

    expect(screen.getByText("src/app/page.tsx")).toBeInTheDocument();
  });
});
