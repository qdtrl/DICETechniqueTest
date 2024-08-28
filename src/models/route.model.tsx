import WaypointProps from "./waypoint.model";

export default interface RouteProps {
  id: string;
  show: boolean;
  name: string;
  startDate: string;
  points: Array<WaypointProps>;
}
