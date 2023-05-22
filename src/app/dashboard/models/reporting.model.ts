import { HttpResponseObject } from "src/app/auth/models/auth.model";
import { Loads } from "./loads.model";

export interface LoadsWithDriver extends HttpResponseObject<Loads> {
  driverName: string;
}
