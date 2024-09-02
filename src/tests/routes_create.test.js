import { render, screen, fireEvent, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import RouteCreate from "../pages/Routes/create"; // Assurez-vous que le chemin est correct
import { RoutesContext, WaypointContext } from "../contexts";

jest.mock("react-router-dom", () => {
  const actualReactRouterDom = jest.requireActual("react-router-dom");
  return {
    ...actualReactRouterDom,
    useNavigate: jest.fn(),
  };
});

describe("RouteCreate Component", () => {
  test("form display", () => {
    const mockRoutesContextValue = {
      routes: [],
      setRoutes: jest.fn(),
    };

    const mockWaypointContextValue = {
      waypoints: [],
      setWaypoints: jest.fn(),
    };

    render(
      <RoutesContext.Provider value={mockRoutesContextValue}>
        <WaypointContext.Provider value={mockWaypointContextValue}>
          <MemoryRouter>
            <RouteCreate />
          </MemoryRouter>
        </WaypointContext.Provider>
      </RoutesContext.Provider>
    );

    // Fill in the new routage details
    fireEvent.change(screen.getByPlaceholderText("Routage 1"), {
      target: { value: "New Routage" },
    });

    // Click the 'Ajouter le point' button

    fireEvent.click(screen.getByText("Ajouter le point"));

    // Check if the new point is added to the table
    expect(screen.getByText("Nouvelle route")).toBeInTheDocument();
  });
});
