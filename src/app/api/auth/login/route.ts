import { NextResponse } from "next/server";
import { sign } from "jsonwebtoken";
import { User } from "@/shared/models/User";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const user = await User.findByEmail(email);

    if (!user || !user.hashedPassword) {
      return new NextResponse("Invalid credentials", { status: 400 });
    }

    const isPasswordValid = await User.comparePassword(password, user.hashedPassword);

    if (!isPasswordValid) {
      return new NextResponse("Invalid credentials", { status: 400 });
    }

    const token = sign(
      {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      process.env.NEXTAUTH_SECRET || "your-secret-key",
      { expiresIn: "1d" }
    );

    return NextResponse.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("[LOGIN]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
