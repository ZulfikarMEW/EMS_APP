import { SystemRoleFunction } from "./SystemRoleFunction";

export class RoleFunction {
  Id: string;
  SystemRoleId: number;
  SystemRoleFunctionId: number;
  AllowView: boolean;
  AllowAdd: boolean;
  AllowEdit: boolean;
  AllowDelete: boolean;
  Tstamp: Date;

  SystemRoleFunction: SystemRoleFunction;
}
