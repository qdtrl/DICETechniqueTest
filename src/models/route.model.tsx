import WaypointProps from "./waypoint.model";

export default interface RouteProps {
  id: string;
  name: string;
  startDate: string;
  points: Array<WaypointProps>;
}
