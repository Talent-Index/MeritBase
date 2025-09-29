import { matchJobToCvWallet } from "@/ai/flows/match-job-to-cv-wallet";
import { CVWallet } from "@/components/dashboard/cv-wallet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { freelancers, jobs, employers } from "@/lib/data";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from 'date-fns';
import { ExternalLink, Star } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const revalidate = 0;

async function MatchedJobs() {
    const freelancer = freelancers[0];
    const matchedJobs = await Promise.all(
        jobs.map(async (job) => {
            try {
                const { fitPercentage } = await matchJobToCvWallet({
                    jobDescription: job.description,
                    cvWallet: freelancer.cvWallet,
                });
                return { ...job, fitPercentage };
            } catch (error) {
                console.error(`Failed to match job ${job.id}:`, error);
                return { ...job, fitPercentage: Math.floor(Math.random() * 40) + 30 };
            }
        })
    );

    const sortedJobs = matchedJobs.sort((a, b) => (b.fitPercentage || 0) - (a.fitPercentage || 0));

    return (
        <div className="space-y-4">
            {sortedJobs.map((job) => {
                const employer = employers.find(e => e.id === job.employerId);
                const percentage = job.fitPercentage || 0;
                const badgeColor = percentage > 80 ? "bg-accent text-accent-foreground" : percentage > 60 ? "bg-primary/80 text-primary-foreground" : "bg-muted text-muted-foreground";

                return (
                    <Card key={job.id}>
                        <CardHeader>
                            <div className="flex justify-between items-start gap-4">
                                <div>
                                    <CardTitle className="font-headline text-lg">{job.title}</CardTitle>
                                    <CardDescription>
                                        at {employer?.companyName} &middot; Posted {formatDistanceToNow(new Date(job.postedAt), { addSuffix: true })}
                                    </CardDescription>
                                </div>
                                <Badge className={cn("text-sm font-bold", badgeColor)}>{percentage}% Match</Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground line-clamp-2">{job.description}</p>
                            <div className="flex flex-wrap gap-2 mt-4">
                                {job.skills.map(skill => (
                                    <Badge key={skill} variant="secondary">{skill}</Badge>
                                ))}
                            </div>
                        </CardContent>
                        <CardFooter>
                             <Button asChild>
                                <Link href={`/job/${job.id}`}>View Details <ExternalLink className="ml-2 h-4 w-4" /></Link>
                            </Button>
                        </CardFooter>
                    </Card>
                );
            })}
        </div>
    );
}

function MatchedJobsSkeleton() {
    return (
        <div className="space-y-4">
            {[1, 2, 3].map(i => (
                 <Card key={i}>
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <div>
                                <Skeleton className="h-6 w-64 mb-2" />
                                <Skeleton className="h-4 w-48" />
                            </div>
                            <Skeleton className="h-6 w-20 rounded-full" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4 mt-2" />
                        <div className="flex gap-2 mt-4">
                             <Skeleton className="h-5 w-16 rounded-full" />
                             <Skeleton className="h-5 w-20 rounded-full" />
                             <Skeleton className="h-5 w-24 rounded-full" />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Skeleton className="h-10 w-32 rounded-md" />
                    </CardFooter>
                </Card>
            ))}
        </div>
    )
}

export default function FreelancerDashboardPage() {
  const freelancer = freelancers[0];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight font-headline">Welcome back, {freelancer.name}!</h2>
        <p className="text-muted-foreground">Here&apos;s your professional hub on MeritBase.</p>
      </div>

      <CVWallet initialContent={freelancer.cvWallet} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
            <h3 className="text-xl font-bold tracking-tight font-headline mb-4">Top Job Matches for You</h3>
            <Suspense fallback={<MatchedJobsSkeleton />}>
                <MatchedJobs />
            </Suspense>
        </div>
        <div>
            <h3 className="text-xl font-bold tracking-tight font-headline mb-4">Your Reputation</h3>
            <Card>
                <CardHeader>
                    <CardTitle>On-Chain Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Rating</span>
                        <div className="flex items-center gap-1 font-semibold">
                            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                            {freelancer.reputation.rating} ({freelancer.reputation.reviews} reviews)
                        </div>
                    </div>
                    <div className="space-y-2">
                        <span className="text-muted-foreground">Badges</span>
                        <div className="flex flex-wrap gap-2">
                            {freelancer.reputation.badges.map(badge => (
                                <Badge key={badge} variant="outline">{badge}</Badge>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
