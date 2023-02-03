import { Context, Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import tokenAuth from "../middleware/token_auth.ts";

export const tokenRouter = new Router()
  .get("/token", tokenAuth, ({ response }: Context) => {
      response.body = {'msg': 'Token OK'}
  })