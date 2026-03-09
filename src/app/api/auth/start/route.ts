import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import crypto from "crypto";
import { isDisposableEmail, rateLimit } from "@/lib/security";
import { getClientIp } from "@/lib/security-monitor";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const isDev = process.env.NODE_ENV === "development";
const CODE_TTL_MS = 10 * 60 * 1000;

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const { allowed } = rateLimit(`auth-start:${ip}`, 8, 60_000);
    if (!allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const { email } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (isDisposableEmail(normalizedEmail)) {
      return NextResponse.json(
        { error: "Disposable email addresses are not allowed" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: { id: true, password: true, status: true },
    });

    if (existingUser && !existingUser.status) {
      return NextResponse.json(
        { error: "This account has been disabled. Please contact support." },
        { status: 403 }
      );
    }

    if (existingUser?.password) {
      return NextResponse.json({
        success: true,
        method: "password",
        message: "Enter your password to sign in",
      });
    }

    const code = crypto.randomInt(100000, 1000000).toString();
    const expiresAt = new Date(Date.now() + CODE_TTL_MS);

    if (existingUser) {
      await prisma.user.update({
        where: { email: normalizedEmail },
        data: { vcode: code, vcodeExpiresAt: expiresAt },
      });
    } else {
      await prisma.user.create({
        data: {
          email: normalizedEmail,
          vcode: code,
          vcodeExpiresAt: expiresAt,
        },
      });
    }

    if (isDev && !resend) {
      console.log("\n" + "=".repeat(50));
      console.log(`VERIFICATION CODE for ${normalizedEmail}`);
      console.log(`Code: ${code}`);
      console.log("=".repeat(50) + "\n");
    } else if (resend) {
      try {
        await resend.emails.send({
          from: process.env.EMAIL_FROM || "GrowTwitch <noreply@growtwitch.com>",
          to: normalizedEmail,
          subject: "Your GrowTwitch Verification Code",
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #9146FF;">GrowTwitch</h1>
              <h2>Your Verification Code</h2>
              <p>Use the following code to verify your email:</p>
              <div style="background: #f4f4f5; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
                <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #9146FF;">${code}</span>
              </div>
              <p style="color: #666;">This code will expire in 10 minutes.</p>
              <p style="color: #666;">If you didn't request this code, please ignore this email.</p>
            </div>
          `,
        });
      } catch (emailError) {
        console.error("Failed to send email:", emailError);
        return NextResponse.json(
          { error: "Failed to send verification email. Please try again." },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      method: "code",
      message: "Verification code sent to your email",
    });
  } catch (error) {
    console.error("Auth start error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
