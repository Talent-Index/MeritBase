'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { generateCvWalletAction, type FormState } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Bot, Loader2, Save, Wallet } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

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
    // In a real app, you'd use a library like ethers.js or viem to connect to a wallet.
    // For this example, we'll simulate a connection.
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
            {walletAddress && <p className={cn("text-xs font-mono p-2 rounded-md bg-muted text-muted-foreground", { 'border border-green-500 text-green-600 bg-green-500/10': walletAddress })}>
              {walletAddress}
            </p>}
        </CardFooter>
      </Card>
    </div>
  );
}
