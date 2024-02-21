import { Injectable, CanActivate, ExecutionContext, NotFoundException } from '@nestjs/common';
// import { Observable } from 'rxjs';
import { UserService } from '../user.service';
import { User } from '../interfaces/user.interface';

@Injectable()
export class UserExistenceGuard implements CanActivate {
  constructor(private readonly userService: UserService) { }

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const shipmentId = request.params.id;
    const user: User = await this.userService.findUser({ _id: shipmentId });

    if (!!user) {
      return true;
    }
    throw new NotFoundException('User not found');
  }
}
