import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import { rateLimit } from "@/lib/security";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;
const isDev = process.env.NODE_ENV === "development";

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const { allowed } = rateLimit(`forgot-pw:${ip}`, 3, 60_000);
    if (!allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const { email } = await request.json();
    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    // Always return success to prevent email enumeration
    if (!user || !user.password) {
      return NextResponse.json({
        success: true,
        message: "If an account exists, a reset code has been sent.",
      });
    }

    const code = String(Math.floor(100000 + Math.random() * 900000));
    await prisma.user.update({
      where: { id: user.id },
      data: { vcode: code },
    });

    if (isDev || !resend) {
      console.log(`\n${"=".repeat(50)}`);
      console.log(`🔑 PASSWORD RESET CODE for ${normalizedEmail}: ${code}`);
      console.log(`${"=".repeat(50)}\n`);
    } else {
      await resend.emails.send({
        from: process.env.EMAIL_FROM || "GrowTwitch <noreply@growtwitch.com>",
        to: normalizedEmail,
        subject: "Password Reset - GrowTwitch",
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #9146FF;">GrowTwitch</h1>
            <h2>Password Reset</h2>
            <p>Use the following code to reset your password:</p>
            <div style="background: #f4f4f5; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
              <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #9146FF;">${code}</span>
            </div>
            <p style="color: #666;">This code will expire in 10 minutes. If you didn't request this, ignore this email.</p>
          </div>
        `,
      });
    }

    return NextResponse.json({
      success: true,
      message: "If an account exists, a reset code has been sent.",
      ...(isDev && { devCode: code }),
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
