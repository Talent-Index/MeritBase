'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { generateCvWalletAction, type FormState } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Bot, Check, Copy, Loader2, Save, Share2, Wallet } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { freelancers } from '@/lib/data';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Bot className="mr-2 h-4 w-4" />}
      Generate with AI
    </Button>
  );
}

export function CVWallet({ initialContent }: { initialContent: string }) {
  const { toast } = useToast();
  const [cvContent, setCvContent] = useState(initialContent);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [copied, setCopied] = useState(false);

  // Assuming we're working with the first freelancer for this demo
  const freelancerId = freelancers[0].id;
  const publicCvUrl = `${window.location.origin}/freelancer/${freelancerId}`;

  const initialState: FormState = { message: '' };
  const [state, formAction] = useFormState(generateCvWalletAction, initialState);

  useEffect(() => {
    if (state.message) {
      toast({
        title: state.cvContent ? "Success!" : "Uh oh!",
        description: state.message,
        variant: state.cvContent ? 'default' : 'destructive'
      });
    }
    if (state.cvContent) {
      setCvContent(state.cvContent);
    }
  }, [state, toast]);

  const handleConnectWallet = async () => {
    setIsConnecting(true);
    try {
      if ((window as any).ethereum) {
        const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts.length > 0) {
            setWalletAddress(accounts[0]);
             toast({
                title: "Wallet Connected!",
                description: `Connected with address: ${accounts[0].substring(0,6)}...${accounts[0].substring(accounts[0].length - 4)}`,
            });
        } else {
            throw new Error("No accounts found.");
        }
      } else {
        throw new Error("MetaMask not found. Please install the browser extension.");
      }
    } catch (error: any) {
        toast({
            variant: "destructive",
            title: "Connection Failed",
            description: error.message || "Could not connect to the wallet.",
        });
    } finally {
        setIsConnecting(false);
    }
  }
  
  const handleCopy = () => {
    navigator.clipboard.writeText(publicCvUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
     toast({
        title: "Copied to clipboard!",
        description: "You can now share your CVWallet link.",
      });
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <form action={formAction}>
          <CardHeader>
            <CardTitle className="font-headline">AI CV Generator</CardTitle>
            <CardDescription>Describe your skills and experience, and let our AI create a professional CV for you.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="prompt">Your Prompt</Label>
              <Textarea
                id="prompt"
                name="prompt"
                placeholder="e.g., 'A senior frontend developer with 8 years of experience in React, specializing in e-commerce platforms and performance optimization...'"
                rows={8}
                required
              />
               {state?.issues && (
                <div className="text-sm font-medium text-destructive">
                  <p>{state.issues[0]}</p>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <SubmitButton />
          </CardFooter>
        </form>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="font-headline">Your CVWallet</CardTitle>
              <CardDescription>This is your on-chain professional identity. Keep it updated to attract the best opportunities.</CardDescription>
            </div>
             <Button variant={walletAddress ? "outline" : "primary"} onClick={handleConnectWallet} disabled={isConnecting}>
                {isConnecting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Wallet className="mr-2 h-4 w-4" />
                {walletAddress ? `Connected: ${walletAddress.substring(0, 6)}...` : "Connect Wallet"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="cv-content">CV Content</Label>
            <Textarea
              id="cv-content"
              value={cvContent}
              onChange={(e) => setCvContent(e.target.value)}
              placeholder="Your generated or manually entered CV content will appear here."
              rows={15}
            />
          </div>
        </CardContent>
        <CardFooter className="justify-between">
            <Button variant="secondary" disabled={!walletAddress}>
                <Save className="mr-2 h-4 w-4" />
                Save & Sign to IPFS
            </Button>
            <Popover>
              <PopoverTrigger asChild>
                 <Button>
                    <Share2 className="mr-2 h-4 w-4" />
                    Share CVWallet
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-96">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Share your public CVWallet</h4>
                  <p className="text-sm text-muted-foreground">
                    Anyone with this link can view your professional profile.
                  </p>
                </div>
                <div className="flex items-center space-x-2 mt-4">
                  <Input value={publicCvUrl} readOnly className="h-9" />
                  <Button onClick={handleCopy} size="sm" className="px-3">
                    <span className="sr-only">Copy</span>
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
        </CardFooter>
      </Card>
    </div>
  );
}
