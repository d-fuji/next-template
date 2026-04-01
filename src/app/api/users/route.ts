import { container } from "@/lib/api/container";
import { createHandler } from "@/lib/api/handler";
import { registerSchema } from "@/lib/validations/auth";

export const POST = createHandler()
  .withBody(registerSchema)
  .withStatus(201)
  .handle(async ({ body }) => {
    await container.auth.register(body.email, body.password, body.name);
    return { ok: true };
  });
