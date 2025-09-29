import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { jobs, employers, freelancers } from "@/lib/data";
import { formatDistanceToNow } from 'date-fns';
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function EmployerDashboardPage() {
  const employer = employers[0];
  const myJobs = jobs.filter(job => job.employerId === employer.id);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight font-headline">Employer Dashboard</h2>
        <p className="text-muted-foreground">Manage your job listings and applicants for {employer.companyName}.</p>
      </div>

      <Tabs defaultValue="my-listings">
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
              <CardDescription>Fill out the details below to find the perfect talent for your project.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="job-title">Job Title</Label>
                <Input id="job-title" placeholder="e.g., Lead Web3 Frontend Developer" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="job-description">Job Description</Label>
                <Textarea id="job-description" placeholder="Describe the role, responsibilities, and requirements..." rows={6} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="skills">Required Skills (comma-separated)</Label>
                    <Input id="skills" placeholder="React, Solidity, Next.js" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="budget">Budget (USD)</Label>
                    <Input id="budget" type="number" placeholder="100000" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Post Job</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="applicants" className="mt-6">
             <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Applicants for Lead Web3 Frontend Developer</CardTitle>
                    <CardDescription>Review the top candidates matched for your role.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {freelancers.map(freelancer => {
                         const profileImage = PlaceHolderImages.find(p => p.id === freelancer.avatar);
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
                                    <Badge variant="outline" className="text-base font-bold border-green-500 text-green-600">92% Match</Badge>
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
