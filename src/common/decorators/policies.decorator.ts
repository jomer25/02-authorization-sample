import { SetMetadata } from "@nestjs/common";
import { Action } from "../enums/action.enum";
import { Subjects } from "src/casl/casl-ability.factory/casl-ability.factory";

export interface PolicyHandler {
  action: Action,
  subjects: Subjects,
}

export const CHECK_POLICIES_KEY = 'check_policy';
export const CheckPolicies = (...handlers: PolicyHandler[]) =>
  SetMetadata(CHECK_POLICIES_KEY, handlers);