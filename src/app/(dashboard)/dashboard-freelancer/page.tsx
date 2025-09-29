'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { freelancers, jobs, employers } from "@/lib/data";
import { ArrowUpRight, DollarSign, Users, Briefcase } from "lucide-react";
import Link from "next/link";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";
import { Calendar } from "@/components/ui/calendar";

const chartData = [
  { name: "Jan", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Feb", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Mar", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Apr", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "May", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Jun", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Jul", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Aug", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Sep", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Oct", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Nov", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Dec", total: Math.floor(Math.random() * 5000) + 1000 },
]

export default function FreelancerDashboardPage() {
  const freelancer = freelancers[0];
  const recentApplicants = freelancers.slice(0, 5); // Mock recent applicants

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight font-headline">Welcome back, {freelancer.name}!</h2>
        <p className="text-muted-foreground">Here&apos;s your professional hub on MeritBase.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Earnings
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Proposals Sent
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+23</div>
            <p className="text-xs text-muted-foreground">
              +180.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gigs Completed</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12</div>
            <p className="text-xs text-muted-foreground">
              +19% from last month
            </p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reputation Score</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.9/5.0</div>
            <p className="text-xs text-muted-foreground">
              Based on 23 reviews
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
             <ResponsiveContainer width="100%" height={350}>
              <BarChart data={chartData}>
                <XAxis
                  dataKey="name"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `$${value}`}
                />
                <Bar dataKey="total" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Job Matches</CardTitle>
            <CardDescription>
              New opportunities curated for you.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {jobs.slice(0,4).map(job => {
                const employer = employers.find(e => e.id === job.employerId);
                const logo = PlaceHolderImages.find(p => p.id === employer?.logo)
                return (
                  <div key={job.id} className="flex items-center">
                    {logo && <Avatar className="h-9 w-9">
                        <Image src={logo.imageUrl} alt={employer?.companyName || 'logo'} width={36} height={36} data-ai-hint={logo.imageHint} />
                    </Avatar>}
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">{job.title}</p>
                      <p className="text-sm text-muted-foreground">{employer?.companyName}</p>
                    </div>
                    <div className="ml-auto font-medium">+${job.budget.toLocaleString()}</div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
              <CardHeader>
                <CardTitle>Top Job Matches for You</CardTitle>
                 <CardDescription>
                    Your skills are in high demand. Check out these top roles.
                </CardDescription>
              </CardHeader>
              <CardContent>
                 <div className="space-y-4">
                    {jobs.map((job) => {
                        const employer = employers.find(e => e.id === job.employerId);
                        return (
                            <Card key={job.id} className="p-4 hover:bg-muted/50 transition-colors">
                                <div className="flex justify-between items-start gap-4">
                                    <div>
                                        <h3 className="font-semibold">{job.title}</h3>
                                        <p className="text-sm text-muted-foreground">
                                            at {employer?.companyName}
                                        </p>
                                    </div>
                                    <Button variant="outline" size="sm" asChild>
                                        <Link href={`/job/${job.id}`}>
                                            View <ArrowUpRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    </Button>
                                </div>
                            </Card>
                        );
                    })}
                </div>
              </CardContent>
          </Card>
          <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Schedule</CardTitle>
                    <CardDescription>Your upcoming deadlines and interviews.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Calendar
                        mode="single"
                        selected={new Date()}
                        className="rounded-md"
                    />
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>Your CVWallet</CardTitle>
                     <CardDescription>
                        Keep your professional identity up-to-date.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                   <Button className="w-full">Manage CVWallet</Button>
                </CardContent>
            </Card>
          </div>
      </div>
    </div>
  );
}
