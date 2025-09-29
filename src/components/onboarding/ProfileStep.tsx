'use client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { auth } from "@/lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function ProfileStep() {
  const [isPending, setIsPending] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsPending(true);
    
    try {
      // For this step, we'll create the user in Firebase Auth.
      // In a real multi-step flow, you'd collect all data first
      // or create the user and then add data to Firestore/PostgreSQL.
      await createUserWithEmailAndPassword(auth, email, password);
      
      toast({
        title: "Profile Step Complete!",
        description: "Your account has been created. Let's upload your documents.",
      });
      
      // Navigate to the next step
      router.push('/signup-freelancer/documents');

    } catch (error: any) {
      console.error("Signup error:", error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error.message || "There was a problem with your request.",
      });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input id="fullName" placeholder="Alice Johnson" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="displayName">Display Name</Label>
          <Input id="displayName" placeholder="Alice" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="alice@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="skills">Primary Skills (comma-separated)</Label>
        <Input id="skills" placeholder="Solidity, Next.js, React" required />
      </div>
       <div className="space-y-2">
        <Label htmlFor="bio">Short Bio</Label>
        <Textarea id="bio" placeholder="Tell us a little about yourself..." required />
      </div>
      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Next: Documents <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
       <p className="text-xs text-center text-muted-foreground pt-4">
            Already have an account?{" "}
            <Link href="/dashboard-freelancer" className="underline hover:text-primary">
                Login
            </Link>
        </p>
    </form>
  );
}
