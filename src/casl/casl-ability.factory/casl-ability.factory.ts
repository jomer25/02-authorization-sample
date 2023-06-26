import { 
  AbilityBuilder, 
  createMongoAbility, 
  ExtractSubjectType, 
  InferSubjects, 
  MongoAbility, 
} from "@casl/ability";
import { Injectable } from "@nestjs/common";
import { User } from "src/users/entities/user.entity";
import { Action } from "../enums/action.enum";

export type Subjects = InferSubjects<typeof User> | 'all';

export type AppAbility = MongoAbility<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User) {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(
      createMongoAbility
    );

    if(user.isAdmin) {
      can(Action.Manage, 'all');
    } else {
      cannot(Action.Manage, 'all').because('only admin!');
    }

    return build({
      detectSubjectType: (item) => item.constructor as ExtractSubjectType<Subjects>,
    })
  }
}