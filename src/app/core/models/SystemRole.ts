import { RoleFunction } from "./RoleFunction";

export class SystemRole {
  Id: number;
  Name: string;
  Description: string;
  Tstamp: Date;
  Active: boolean;

  RoleFunctions: RoleFunction[];
}
