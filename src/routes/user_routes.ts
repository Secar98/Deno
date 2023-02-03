
import { BodyJson, Context, Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";
import { create, getNumericDate } from "https://deno.land/x/djwt@v2.8/mod.ts"
import { User } from "../models/user.ts";
import tokenAuth from "../middleware/token_auth.ts";
import { Key } from "../utils/crypto_key.ts";

const userRouter = new Router()

userRouter.post("/register", async ({request, response}: Context) => {
  const body = request.body({ type: "json" });
  const {email, password, name} = await body.value;

  console.log(email, password, name);

  const hash: string = await bcrypt.hash(password, await bcrypt.genSalt());

  try {
    await User.create({email, hash, name,})
  } catch (_) {
    response.status = 500
    return response.body = {'error': 'Could not create User!'}
  }

  response.status = 201
  response.body = {'msg': 'User created!'}
});

userRouter.post("/login", async ({request, response}: Context) => {
  const body: BodyJson = request.body({ type: "json" });
  
  const {email, password}: LoginDTO = await body.value;

  const user: User = await User.where('email', email).first();

  if (!user) {
    response.status = 400
    return response.body = {'error': 'Not registerd or Bad Credentials'}
  }

  const hash: string | undefined = user.hash?.toString();
  const id: string | undefined = user.id?.toString();

  if (hash !== undefined) {
    const success = await bcrypt.compare(password, hash);

    if (success && (id != undefined)) {
      const payload = {
        iss: "https://auth.denoland.com",
        sub: id, 
        email: email,
        exp: getNumericDate(60 * 60)
      }
      const token: string = await create({alg: "HS512", typ: "JWT"}, payload, await Key.getKey())
      
      response.status = 200
      return response.body = { 'token': token }
    }
  }
    
  response.status = 400
  return response.body = {'error': 'Not registerd or Bad Credentials'}
});


userRouter.get("/info", tokenAuth, async ({response, state}: Context) => {
    const payload: Payload = state.user;
    
    const user: User = await User.where('email', payload.email).first();

    if (!user) {
      response.status = 400
      return response.body = {'error': 'Not registerd or Bad Credentials'}
    }

    response.body = {'msg': 'test'}
})

export interface Payload {
  iss: string,
  sub: string, 
  email: string,
  exp: number
}
export interface LoginDTO {
  email: string;
  password: string;
}

export default userRouter;