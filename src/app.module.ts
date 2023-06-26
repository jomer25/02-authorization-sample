import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { CommonModule } from './common/common.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    CommonModule, 
    CoreModule, 
    UsersModule
  ],
})
export class AppModule {}
