'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { generateCvWalletAction, type FormState } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Bot, Loader2, Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

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
          <CardTitle className="font-headline">Your CVWallet</CardTitle>
          <CardDescription>This is your on-chain professional identity. Keep it updated to attract the best opportunities.</CardDescription>
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
        <CardFooter>
            <Button variant="secondary">
                <Save className="mr-2 h-4 w-4" />
                Save & Sign to IPFS
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
