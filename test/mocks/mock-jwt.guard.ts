import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class MockJwtGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    request.user = { id: 1 };
    return true;
  }
}

