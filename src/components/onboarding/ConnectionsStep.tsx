
'use client';
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const socialPlatforms = [
    { name: 'LinkedIn', icon: 'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z M2 9h4v12H2z M4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z' },
    { name: 'Upwork', icon: 'M14.1.08 11.52q0-1.56-1-2.64-1-1.08-2.76-1.08H5.28v5.52h5.16q1.56 0 2.52-.96.96-.96.96-2.88zm3 .72q0 2.64-1.68 4.2-1.68 1.56-4.56 1.56H2.64V5.04h8.28q2.88 0 4.56 1.68 1.68 1.68 1.68 4.56zM21.36 18h-2.64v-5.64q0-1.08-.48-1.56-.48-.48-1.44-.48-1.08 0-1.68.84t-.6 2.16V18h-2.64V5.28h2.64v1.08q.84-1.2 2.64-1.2 1.44 0 2.4.96.96.96.96 3v8.88z' },
    { name: 'Fiverr', icon: 'M19.92 14.52h-2.64v-1.44h2.64v-1.44h-2.64v-1.44h1.92V8.76h-1.92V7.32h2.64V5.16h-5.28V18h5.28v-3.48zm-7.92 0q-1.08 0-1.68-.6-.6-.6-.6-1.8V5.16h-1.92v7.2q0 2.16 1.2 3.24 1.2 1.08 3.24 1.08 1.68 0 2.64-1.08v-1.08h-2.88z' },
];

export default function ConnectionsStep() {
    const [isPending, setIsPending] = useState(false);
    const [connected, setConnected] = useState<string[]>([]);
    const router = useRouter();
    const { toast } = useToast();

    const handleConnect = (platformName: string) => {
        if (platformName === 'LinkedIn') {
            // NOTE: Replace with your actual LinkedIn Client ID and Redirect URI
            const LINKEDIN_CLIENT_ID = 'YOUR_LINKEDIN_CLIENT_ID';
            const REDIRECT_URI = 'http://localhost:3000/linkedin/callback';
            const STATE = 'some_random_state'; // It is recommended to generate a random state
            
            const scope = encodeURIComponent('profile openid');
            const linkedinAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${LINKEDIN_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&state=${STATE}&scope=${scope}`;
            
            window.location.href = linkedinAuthUrl;
        } else {
            if (connected.includes(platformName)) {
                setConnected(connected.filter(p => p !== platformName));
                 toast({ title: `${platformName} disconnected.` });
            } else {
                setConnected([...connected, platformName]);
                toast({ title: `Simulating ${platformName} connection...`, description: "In a real app, this would open OAuth." });
            }
        }
    }

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsPending(true);

        setTimeout(() => {
            toast({
                title: "Connections Saved!",
                description: "Next, please verify your identity.",
            });
            router.push('/signup-freelancer/documents');
            setIsPending(false);
        }, 1000);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4">
                {socialPlatforms.map(platform => (
                    <div key={platform.name} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d={platform.icon}></path></svg>
                            <span className="font-semibold">{platform.name}</span>
                        </div>
                        <Button 
                            type="button" 
                            variant={connected.includes(platform.name) ? 'secondary' : 'outline'}
                            onClick={() => handleConnect(platform.name)}
                        >
                            {connected.includes(platform.name) ? 'Connected' : 'Connect'}
                        </Button>
                    </div>
                ))}
            </div>

            <div className="flex justify-between items-center pt-4">
                 <Button type="button" variant="ghost" onClick={() => router.push('/signup-freelancer/documents')}>
                    Skip for now
                 </Button>
                 <Button type="submit" disabled={isPending} size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold hover:opacity-90 transition-opacity">
                    {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Next: Verification <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </div>
        </form>
    );
}
