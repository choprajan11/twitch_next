import { redirect } from "next/navigation";

export const metadata = {
  title: "Sign Up - GrowTwitch",
  description: "Create your GrowTwitch account to start growing your Twitch channel.",
};

export default function RegisterPage() {
  redirect("/login");
}
