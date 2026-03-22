import { NextResponse } from "next/server";
import { registerUser } from "@/lib/auth-service";
import { handleError, parseBody } from "@/lib/api-utils";
import { registerSchema } from "@/lib/validations/auth";

export async function POST(request: Request) {
  try {
    const data = await parseBody(request, registerSchema);
    await registerUser(data.email, data.password, data.name);
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}
