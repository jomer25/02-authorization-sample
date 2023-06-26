import { 
  ForbiddenException, 
  Injectable, 
  NotFoundException 
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory/casl-ability.factory';
import { ForbiddenError } from '@casl/ability';
import { Action } from 'src/casl/enums/action.enum';

export const currentUser = [
  { id: 1, isAdmin: true, name: "Jomer Adrian" },
  { id: 2, isAdmin: false, name: "Jane Doe" },
  { id: 3, isAdmin: true, name: "Joanna Marie" },
];

@Injectable()
export class UsersService {  
  constructor(private readonly caslAbilityFactory: CaslAbilityFactory) {}
  
  private users: User[] = currentUser;

  create(createUserDto: CreateUserDto) {
    const ability = this.caslAbilityFactory.createForUser(createUserDto);
    try {
      ForbiddenError
        .from(ability)
        .throwUnlessCan(Action.Create, User);
    } catch (error) {
      if(error instanceof ForbiddenError) {
        throw new ForbiddenException(error.message);
      }
    }

    const newUser = {
      id: this.users.length + 1,
      ...createUserDto,
    }
    this.users.push(newUser);
  }

  findAll() {
    return this.users;
  }

  findOne(id: number) {
    const user = this.users.find(user => user.id === id);
    if(user) {
      return user;
    }
    throw new NotFoundException(`User id: #${id} not found!`);
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    const ability = this.caslAbilityFactory.createForUser(updateUserDto);
    const userToUpdate = this.findOne(id);
    try {
      ForbiddenError
        .from(ability)
        .throwUnlessCan(Action.Update, userToUpdate);
    } catch (error) {
      if(error instanceof ForbiddenError) {
        throw new ForbiddenException(error.message);
      }
    }

    const user = this.users.find(user => user.id === id);
    if(user) {
      user.isAdmin = updateUserDto.isAdmin || user.isAdmin;
      return user;
    }
    throw new NotFoundException(`User id: #${id} not found!`);
  }

  remove(id: number) {
    const index = this.users.findIndex(user => user.id === id);
    if(index !== -1) {
      this.users.splice(index, 1);
      return index;
    }
    throw new NotFoundException(`User id: #${id} not found!`);
  }
}
