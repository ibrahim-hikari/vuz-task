import { Module } from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from '../auth/middleware/roles.guard';

@Module({
  providers: [
    JwtAuthGuard,
    RolesGuard,
  ],
  exports: [
    JwtAuthGuard,
    RolesGuard
  ],
})
export class CommonModule { }
