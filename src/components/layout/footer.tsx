import { Logo } from "@/components/icons";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t">
      <div className="container flex items-center justify-between py-6">
        <Link href="/" className="flex items-center space-x-2">
          <Logo className="h-6 w-6" />
          <p className="font-semibold font-headline">MeritBase</p>
        </Link>
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} MeritBase. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
