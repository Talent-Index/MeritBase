'use client';
import { matchJobToCvWallet } from "@/ai/flows/match-job-to-cv-wallet";
import { generateJobDescription } from "@/ai/flows/generate-job-description";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { jobs, employers, freelancers, type Freelancer } from "@/lib/data";
import { formatDistanceToNow } from 'date-fns';
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Bot, Loader2, Search } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

type FreelancerWithFit = Freelancer & { fitPercentage: number };

export default function EmployerDashboardPage() {
  const employer = employers[0];
  const myJobs = jobs.filter(job => job.employerId === employer.id);

  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isMatching, setIsMatching] = useState(false);
  const [jobDescriptionPrompt, setJobDescriptionPrompt] = useState('');
  const [generatedJobDescription, setGeneratedJobDescription] = useState('');
  const [matchedFreelancers, setMatchedFreelancers] = useState<FreelancerWithFit[]>([]);
  const [activeTab, setActiveTab] = useState("my-listings");

  const handleGenerateDescription = async () => {
    if (!jobDescriptionPrompt) {
      toast({
        variant: "destructive",
        title: "Prompt is empty",
        description: "Please enter a prompt to generate a job description.",
      });
      return;
    }
    setIsGenerating(true);
    setGeneratedJobDescription('');
    try {
      const { jobDescription } = await generateJobDescription({ prompt: jobDescriptionPrompt });
      setGeneratedJobDescription(jobDescription);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Failed to generate description",
        description: "An error occurred while generating the job description.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleMatchFreelancers = async () => {
    if (!generatedJobDescription) {
      toast({
        variant: "destructive",
        title: "No job description",
        description: "Please generate a job description first.",
      });
      return;
    }
    setIsMatching(true);
    setMatchedFreelancers([]);
    try {
      const matches = await Promise.all(
        freelancers.map(async (freelancer) => {
          const { fitPercentage } = await matchJobToCvWallet({
            jobDescription: generatedJobDescription,
            cvWallet: freelancer.cvWallet,
          });
          return { ...freelancer, fitPercentage };
        })
      );
      const sortedMatches = matches.sort((a, b) => b.fitPercentage - a.fitPercentage);
      setMatchedFreelancers(sortedMatches);
      setActiveTab("applicants"); // Switch to applicants tab to show results
      toast({
        title: "Matching complete!",
        description: `Found ${sortedMatches.length} potential candidates.`,
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Failed to match freelancers",
        description: "An error occurred during the matching process.",
      });
    } finally {
      setIsMatching(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight font-headline">Employer Dashboard</h2>
        <p className="text-muted-foreground">Manage your job listings and applicants for {employer.companyName}.</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="my-listings">My Listings</TabsTrigger>
          <TabsTrigger value="post-job">Post a New Job</TabsTrigger>
          <TabsTrigger value="applicants">Applicants</TabsTrigger>
        </TabsList>

        <TabsContent value="my-listings" className="mt-6">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Your Active Job Listings</CardTitle>
                    <CardDescription>View and manage the jobs you've posted.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {myJobs.map(job => (
                        <Card key={job.id} className="flex flex-col sm:flex-row items-start gap-4 p-4">
                            <div className="flex-1">
                                <h3 className="font-semibold">{job.title}</h3>
                                <p className="text-sm text-muted-foreground">Posted {formatDistanceToNow(new Date(job.postedAt), { addSuffix: true })}</p>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {job.skills.map(skill => (
                                        <Badge key={skill} variant="secondary">{skill}</Badge>
                                    ))}
                                </div>
                            </div>
                            <Button variant="outline" asChild><Link href={`/job/${job.id}`}>View Applicants (3)</Link></Button>
                        </Card>
                    ))}
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="post-job" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Create a Job Posting</CardTitle>
              <CardDescription>Use our AI to generate a detailed job description and find talent instantly.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="job-prompt">Job Prompt</Label>
                <Textarea 
                  id="job-prompt" 
                  placeholder="e.g., 'A senior solidity developer to build an NFT marketplace on Polygon. Must know ERC-721 standards.'"
                  value={jobDescriptionPrompt}
                  onChange={(e) => setJobDescriptionPrompt(e.target.value)}
                />
              </div>
              <Button onClick={handleGenerateDescription} disabled={isGenerating}>
                {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Bot className="mr-2 h-4 w-4" />}
                Generate Description
              </Button>
              {generatedJobDescription && (
                 <div className="space-y-2 pt-4">
                    <Label htmlFor="job-description">Generated Job Description</Label>
                    <Textarea id="job-description" value={generatedJobDescription} readOnly rows={8} className="bg-muted" />
                 </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row items-start gap-4">
              <Button onClick={handleMatchFreelancers} disabled={isMatching || !generatedJobDescription}>
                 {isMatching ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                Find Matches
              </Button>
               <Button variant="secondary" disabled={!generatedJobDescription}>Post Job Listing</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="applicants" className="mt-6">
             <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Matched Applicants</CardTitle>
                    <CardDescription>
                      {matchedFreelancers.length > 0
                        ? "Review the top candidates matched for your generated job."
                        : "Applicants will appear here after you run the matching process."}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {matchedFreelancers.map(freelancer => {
                         const profileImage = PlaceHolderImages.find(p => p.id === freelancer.avatar);
                         const percentage = freelancer.fitPercentage;
                         const badgeColor = percentage > 80 ? "border-green-500 text-green-600" : percentage > 60 ? "border-yellow-500 text-yellow-600" : "border-gray-400 text-gray-500";
                         
                         return (
                            <Card key={freelancer.id} className="p-4">
                                <div className="flex items-center gap-4">
                                     {profileImage && <Image
                                        src={profileImage.imageUrl}
                                        alt={freelancer.name}
                                        width={56}
                                        height={56}
                                        data-ai-hint={profileImage.imageHint}
                                        className="rounded-full"
                                    />}
                                    <div className="flex-1">
                                        <h4 className="font-semibold">{freelancer.name}</h4>
                                        <p className="text-sm text-muted-foreground">{freelancer.title}</p>
                                    </div>
                                    <Badge variant="outline" className={`text-base font-bold ${badgeColor}`}>
                                        {percentage}% Match
                                    </Badge>
                                    <Button>View CVWallet</Button>
                                </div>
                            </Card>
                         )
                    })}
                </CardContent>
             </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
