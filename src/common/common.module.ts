import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { AllExceptionsFilter } from './filters/http-exception.filter';
import { PoliciesGuard } from './guards/policies.guard';
import { CaslModule } from 'src/casl/casl.module';

@Module({
  imports: [CaslModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: PoliciesGuard,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    }
  ]
})
export class CommonModule {}
