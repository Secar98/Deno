import { Payload, verify } from "https://deno.land/x/djwt@v2.8/mod.ts";
import { Context } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { Key } from "../utils/crypto_key.ts";


export default async function tokenAuth (ctx: Context, next: () => Promise<unknown>) {
  const headers: Headers = ctx.request.headers;
  const jwt: string | null = headers.get('Authorization');

  if (!jwt) {
    ctx.response.status = 401
    return ctx.response.body = {'error': 'Missing token'}
  } else {
    try {
      const parsedJwt = jwt.split(" ")[1];
      const payload: Payload = await verify(parsedJwt, await Key.getKey());
      ctx.state.user = payload;
      await next()
    } catch(_) {
      ctx.response.status = 401
      return ctx.response.body = {'error': 'Not authorized'}
    }
  }
}