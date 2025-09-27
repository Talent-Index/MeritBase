import { redirect } from "next/navigation";

export default function Page() {
  // Redirect root to the MeritBase page so it becomes the landing page
  redirect("/meritbase");
}
