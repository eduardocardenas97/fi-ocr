import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";

export const CurrentUser = createParamDecorator(
  (roles = [], contex: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(contex);

    const user = ctx.getContext().req.user;

    if (!user) {
      throw new UnauthorizedException("Usuario no autenticado");
    }

    return user;
  },
);
