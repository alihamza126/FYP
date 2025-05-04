import { NextResponse } from "next/server";
import { User } from "@/shared/models/User";

export async function POST(req: Request) {
  try {
    // Check for admin creation token
    const adminToken = req.headers.get("x-admin-token");
    if (adminToken !== process.env.ADMIN_CREATION_TOKEN) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

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
      role: "ADMIN",
    });

    return NextResponse.json({
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
    });
  } catch (error) {
    console.error("[ADMIN_CREATE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
