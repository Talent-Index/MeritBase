
'use client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, Plus, X } from "lucide-react";
import Link from "next/link";
import { FormEvent, useState, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { popularSkills } from "@/lib/skills";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export default function ProfileStep() {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [customSkill, setCustomSkill] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);

  const availableSkills = useMemo(() => {
    return popularSkills.filter(skill => !selectedSkills.includes(skill));
  }, [selectedSkills]);

  const handleSelectSkill = (skill: string) => {
    if (!selectedSkills.includes(skill)) {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSelectedSkills(selectedSkills.filter(skill => skill !== skillToRemove));
  };

  const handleAddCustomSkill = () => {
    if (customSkill && !selectedSkills.includes(customSkill)) {
      setSelectedSkills([...selectedSkills, customSkill]);
      setCustomSkill("");
      setShowCustomInput(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsPending(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Profile Step Complete!",
        description: "Your account has been created. Let's upload your documents.",
      });
      
      router.push('/signup-freelancer/documents');
      setIsPending(false);
    }, 1000);
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
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            required
          />
        </div>
      </div>
       <div className="space-y-2">
        <Label htmlFor="bio">Short Bio</Label>
        <Textarea id="bio" placeholder="Tell us a little about yourself..." required />
      </div>
      <div className="space-y-3">
        <Label>Primary Skills</Label>
        <div className="p-3 border rounded-lg bg-background/50">
           <div className="flex items-center gap-2 mb-3">
             <ScrollArea className="h-20 w-full">
                <div className="flex flex-wrap gap-2 items-center">
                    {selectedSkills.map(skill => (
                        <Badge key={skill} variant="secondary" className="text-xs py-1 px-2">
                        {skill}
                        <button type="button" onClick={() => handleRemoveSkill(skill)} className="ml-2 rounded-full hover:bg-muted-foreground/20 p-0.5">
                            <X className="h-3 w-3" />
                        </button>
                        </Badge>
                    ))}
                    {showCustomInput && (
                        <div className="flex items-center gap-2">
                            <Input 
                                value={customSkill} 
                                onChange={(e) => setCustomSkill(e.target.value)}
                                placeholder="Your skill..."
                                className="h-7 text-xs"
                            />
                            <Button type="button" size="sm" onClick={handleAddCustomSkill} className="h-7">Add</Button>
                        </div>
                    )}
                </div>
             </ScrollArea>
             <button
                type="button"
                onClick={() => setShowCustomInput(true)}
                className={cn(
                    "px-3 py-1 text-sm border rounded-full hover:border-primary hover:bg-primary/10 transition-colors flex items-center gap-1 shrink-0",
                    { 'hidden': showCustomInput }
                )}
            >
              <Plus className="h-4 w-4" /> Add Skill
            </button>
           </div>
           <ScrollArea className="h-40">
              <div className="flex flex-wrap gap-2">
                  {availableSkills.map(skill => (
                    <button
                        type="button"
                        key={skill}
                        onClick={() => handleSelectSkill(skill)}
                        className="px-3 py-1 text-xs border rounded-full hover:border-primary hover:bg-primary/10 transition-colors"
                    >
                      {skill}
                    </button>
                  ))}
              </div>
           </ScrollArea>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 gap-4">
         <p className="text-xs text-muted-foreground">
            Already have an account?{" "}
            <Link href="/dashboard-freelancer" className="text-purple-400 hover:underline">
                Login
            </Link>
        </p>
        <Button type="submit" disabled={isPending} size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold hover:opacity-90 transition-opacity">
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Next: Documents <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
