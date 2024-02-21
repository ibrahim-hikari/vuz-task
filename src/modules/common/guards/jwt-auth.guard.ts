import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { verify, decode } from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.validateRequest(request);
  }

  private validateRequest(request: Request): boolean {
    const authHeader = request.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid authorization header');
    }

    const token = authHeader.split(' ')[1];
    const isValid: boolean = this.validateToken(token);
    
    if (!token || !isValid) {
      throw new UnauthorizedException('Invalid token');
    }
    request['user'] = decode(token);

    return true;
  }

  private validateToken(token: string): boolean {
    try {
      verify(token, process.env.JWT_SECRET);

      return true;
    } catch (error) {
      console.error(error);

      return false;
    }
  }
}
