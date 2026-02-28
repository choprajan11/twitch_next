import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import { isDisposableEmail, rateLimit } from "@/lib/security";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const isDev = process.env.NODE_ENV === "development";

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const { allowed } = rateLimit(`send-code:${ip}`, 5, 60_000);
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

    if (isDisposableEmail(normalizedEmail)) {
      return NextResponse.json(
        { error: "Disposable email addresses are not allowed" },
        { status: 400 }
      );
    }
    const code = generateCode();

    let user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    const isNewUser = !user;

    if (user) {
      await prisma.user.update({
        where: { email: normalizedEmail },
        data: { vcode: code },
      });
    } else {
      user = await prisma.user.create({
        data: {
          email: normalizedEmail,
          vcode: code,
        },
      });
    }

    // In development without Resend configured, just log the code
    if (isDev || !resend) {
      console.log("\n" + "=".repeat(50));
      console.log(`📧 VERIFICATION CODE for ${normalizedEmail}`);
      console.log(`🔑 Code: ${code}`);
      console.log("=".repeat(50) + "\n");
      
      return NextResponse.json({
        success: true,
        isNewUser,
        message: "Verification code sent",
        // Include code in response for dev testing
        ...(isDev && { devCode: code }),
      });
    }

    // Send verification email in production
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
        { error: "Failed to send verification email" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      isNewUser,
      message: "Verification code sent",
    });
  } catch (error) {
    console.error("Error sending code:", error);
    return NextResponse.json(
      { error: "Failed to send verification code" },
      { status: 500 }
    );
  }
}
