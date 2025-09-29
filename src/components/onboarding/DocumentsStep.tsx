'use client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, FileUp, Github, Link as LinkIcon, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function DocumentsStep() {
    const [isPending, setIsPending] = useState(false);
    const router = useRouter();
    const { toast } = useToast();

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsPending(true);

        // Simulate document upload and processing
        setTimeout(() => {
            toast({
                title: "Documents Uploaded!",
                description: "Next, you'll review and anchor your CVWallet on-chain.",
            });
            // In a real app, you'd navigate to the next step, e.g., '/signup-freelancer/review'
            router.push('/dashboard-freelancer');
            setIsPending(false);
        }, 1500);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="cv-upload">Upload CV (PDF)</Label>
                <div className="relative">
                    <Input id="cv-upload" type="file" className="pl-12" accept=".pdf" required />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <FileUp className="w-5 h-5 text-muted-foreground" />
                    </div>
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="gov-id-upload">Government ID (PDF, JPG, PNG)</Label>
                 <div className="relative">
                    <Input id="gov-id-upload" type="file" className="pl-12" accept=".pdf,.jpg,.jpeg,.png" required />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <FileUp className="w-5 h-5 text-muted-foreground" />
                    </div>
                </div>
                <p className="text-xs text-muted-foreground">For verification purposes only. Your data is encrypted and secure.</p>
            </div>
             <div className="space-y-2">
                <Label htmlFor="github-url">GitHub Profile URL (Optional)</Label>
                <div className="relative">
                    <Input id="github-url" type="url" placeholder="https://github.com/yourusername" className="pl-12" />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Github className="w-5 h-5 text-muted-foreground" />
                    </div>
                </div>
            </div>
             <div className="space-y-2">
                <Label htmlFor="portfolio-url">Portfolio URL (Optional)</Label>
                 <div className="relative">
                    <Input id="portfolio-url" type="url" placeholder="https://yourportfolio.com" className="pl-12" />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <LinkIcon className="w-5 h-5 text-muted-foreground" />
                    </div>
                </div>
            </div>
            <div className="flex justify-end pt-4">
                <Button type="submit" disabled={isPending}>
                    {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Next: Review & Anchor <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </div>
        </form>
    );
}
