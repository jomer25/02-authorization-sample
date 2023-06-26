import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { CaslAbilityFactory } from "src/casl/casl-ability.factory/casl-ability.factory";
import { CHECK_POLICIES_KEY, PolicyHandler } from "../decorators/policies.decorator";
import { ForbiddenError } from "@casl/ability";
import { User } from "src/users/entities/user.entity";

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const policyHandlers =
      this.reflector.getAllAndOverride<PolicyHandler[]>(
        CHECK_POLICIES_KEY,
        [context.getHandler(), context.getClass()],
      ) || [];

    const user = User;
    const ability = this.caslAbilityFactory.createForUser(new user);

    try {
      policyHandlers.forEach((policy) =>
        ForbiddenError.from(ability).throwUnlessCan(policy.action, policy.subjects),
      );

      return true;
    } catch (error) {
      if(error instanceof ForbiddenError) {
        throw new ForbiddenException(error.message);
      }
    }
  }
}