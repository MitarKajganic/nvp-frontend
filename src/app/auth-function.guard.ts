import { inject } from '@angular/core';
import { AuthGuard } from './auth.guard';

export const authFunctionGuard = (routeData: any) => {
  return inject(AuthGuard).canActivate(routeData);
};
