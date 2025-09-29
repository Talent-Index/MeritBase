import { jobs, employers } from "@/lib/data";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Briefcase, Clock, CheckCircle } from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { format } from "date-fns";

export default function JobDetailPage({ params }: { params: { id: string } }) {
  const job = jobs.find((j) => j.id === params.id);

  if (!job) {
    notFound();
  }

  const employer = employers.find((e) => e.id === job.employerId);
  const employerLogo = PlaceHolderImages.find(p => p.id === employer?.logo);

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex items-start gap-4">
            {employerLogo && (
              <Image
                src={employerLogo.imageUrl}
                alt={employer?.companyName || "Company Logo"}
                width={64}
                height={64}
                data-ai-hint={employerLogo.imageHint}
                className="rounded-lg border"
              />
            )}
            <div>
              <CardTitle className="text-2xl font-headline">{job.title}</CardTitle>
              <CardDescription className="text-base">
                {employer?.companyName}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2 p-3 bg-secondary rounded-lg">
                    <DollarSign className="w-5 h-5 text-primary" />
                    <div>
                        <p className="text-muted-foreground">Budget</p>
                        <p className="font-semibold">${job.budget.toLocaleString()}</p>
                    </div>
                </div>
                 <div className="flex items-center gap-2 p-3 bg-secondary rounded-lg">
                    <Clock className="w-5 h-5 text-primary" />
                    <div>
                        <p className="text-muted-foreground">Posted</p>
                        <p className="font-semibold">{format(new Date(job.postedAt), 'MMMM d, yyyy')}</p>
                    </div>
                </div>
                 <div className="flex items-center gap-2 p-3 bg-secondary rounded-lg">
                    <Briefcase className="w-5 h-5 text-primary" />
                    <div>
                        <p className="text-muted-foreground">Type</p>
                        <p className="font-semibold">Contract</p>
                    </div>
                </div>
                 <div className="flex items-center gap-2 p-3 bg-secondary rounded-lg">
                    <CheckCircle className="w-5 h-5 text-accent" />
                    <div>
                        <p className="text-muted-foreground">Match</p>
                        <p className="font-semibold text-accent">92% Match</p>
                    </div>
                </div>
            </div>

            <div>
                <h3 className="font-semibold text-lg mb-2 font-headline">Job Description</h3>
                <p className="text-muted-foreground whitespace-pre-line">
                    {job.description}
                </p>
            </div>
            
            <div>
                <h3 className="font-semibold text-lg mb-2 font-headline">Required Skills</h3>
                <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-sm">{skill}</Badge>
                    ))}
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <Button size="lg">Apply for this Gig</Button>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
