import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileUp } from "lucide-react";
import Link from "next/link";

export default function SignupEmployerPage() {
  return (
    <Card className="w-full max-w-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-headline">Join as an Employer</CardTitle>
        <CardDescription>
          Find and hire top decentralized talent.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="company-name">Company Name</Label>
          <Input id="company-name" placeholder="DecentraCorp" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Work Email</Label>
          <Input id="email" type="email" placeholder="hr@example.com" required />
        </div>
         <div className="space-y-2">
            <Label htmlFor="license">Company License</Label>
            <div className="relative">
                <Input id="license" type="file" className="pl-12" required />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FileUp className="w-5 h-5 text-muted-foreground" />
                </div>
            </div>
            <p className="text-xs text-muted-foreground">For verification purposes only. Your data is secure.</p>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button className="w-full" type="submit">Create Company Account</Button>
         <p className="text-xs text-center text-muted-foreground">
            Already have an account?{" "}
            <Link href="/dashboard-employer" className="underline hover:text-primary">
                Login
            </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
