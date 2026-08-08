import { NextResponse } from "next/server";
import { db } from "@/db";
import { users, organizations } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, organizationName } = body;

    // Validate input
    if (!name || !email || !password || !organizationName) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    // Create organization with 3-month free trial
    const trialEndsAt = new Date();
    trialEndsAt.setMonth(trialEndsAt.getMonth() + 3);

    const slug = organizationName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const [organization] = await db
      .insert(organizations)
      .values({
        name: organizationName,
        slug: slug + "-" + randomBytes(4).toString("hex"),
        planType: "free_trial",
        trialEndsAt,
        subscriptionStatus: "trialing",
        maxProjects: 5,
        maxUsers: 10,
      })
      .returning();

    // Create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = "user_" + randomBytes(8).toString("hex");

    await db.insert(users).values({
      id: userId,
      name,
      email,
      password: hashedPassword,
      role: "admin", // First user is admin
      organizationId: organization.id,
    });

    return NextResponse.json(
      { message: "Account created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Failed to create account" },
      { status: 500 }
    );
  }
}
