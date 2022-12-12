import { SetMetadata } from '@nestjs/common';
import { Roles } from '../../user/enums/user-roles.enum';

export const Role = (role: Roles) => SetMetadata('role', role);
