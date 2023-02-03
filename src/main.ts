import { Application, Context, Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { db } from "./db.ts";
import { User } from "./models/user.ts";
import { tokenRouter } from "./routes/token_routes.ts";
import userRouter from "./routes/user_routes.ts";

const PORT = 8080
const app = new Application();

db.link([User])
db.sync({ drop: true })
  .then(() => {
    console.log('DB synced')
  })
  .catch(error => console.error(error));

app.use(async (ctx: Context, next: () => Promise<unknown>) => {
  await next();
  const rt = ctx.response.headers.get("X-Response-Time");
  console.log(`${ctx.request.method} ${ctx.request.url} - ${rt}`);
});

app.use(async (ctx: Context, next: () => Promise<unknown>) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.response.headers.set("X-Response-Time", `${ms}ms`);
});



const routes = new Router()
  .use("/user", userRouter.routes(), userRouter.allowedMethods());

await app
  .use(tokenRouter.routes())
  .use(routes.routes())
  .listen({ port: PORT })
  .then(() => console.log(`Server started on port: ${PORT}`));