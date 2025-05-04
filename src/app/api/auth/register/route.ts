import { NextResponse } from "next/server";
import { User } from "@/shared/models/User";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, name, password } = body;

    if (!email || !name || !password) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const existingUser = await User.findByEmail(email);

    if (existingUser) {
      return new NextResponse("Email already exists", { status: 400 });
    }

    const hashedPassword = await User.hashPassword(password);

    const user = await User.create({
      email,
      name,
      hashedPassword,
      role: "USER",
    });

    return NextResponse.json({
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
    });
  } catch (error) {
    console.error("[REGISTER]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
