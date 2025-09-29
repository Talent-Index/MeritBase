import { freelancers } from "@/lib/data";
import { notFound } from "next/navigation";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, ShieldCheck, Award } from "lucide-react";

export default function FreelancerPublicPage({ params }: { params: { id: string } }) {
  const freelancer = freelancers.find((f) => f.id === params.id);

  if (!freelancer) {
    notFound();
  }

  const profileImage = PlaceHolderImages.find(p => p.id === freelancer.avatar);

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto max-w-4xl py-12 md:py-20 px-4">
        <Card className="overflow-hidden shadow-2xl shadow-primary/10">
          <div className="bg-gradient-to-br from-primary/10 to-secondary/10 p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {profileImage && (
                <Image
                  src={profileImage.imageUrl}
                  alt={freelancer.name}
                  width={160}
                  height={160}
                  data-ai-hint={profileImage.imageHint}
                  className="rounded-full border-4 border-background shadow-lg"
                />
              )}
              <div className="text-center md:text-left">
                <h1 className="text-4xl font-bold font-headline">{freelancer.name}</h1>
                <p className="text-xl text-primary font-semibold">{freelancer.title}</p>
                <div className="flex items-center justify-center md:justify-start gap-4 mt-2 text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="font-semibold">{freelancer.reputation.rating.toFixed(1)}</span>
                        <span>({freelancer.reputation.reviews} reviews)</span>
                    </div>
                </div>
              </div>
            </div>
          </div>
          <CardContent className="p-8 md:p-12 space-y-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold font-headline border-b pb-2">Professional Summary</h2>
              <p className="text-muted-foreground whitespace-pre-line text-base leading-relaxed">
                {freelancer.cvWallet}
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold font-headline border-b pb-2">Core Skills</h2>
              <div className="flex flex-wrap gap-2">
                {freelancer.skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="text-md px-4 py-1">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold font-headline border-b pb-2">Reputation & Badges</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                 {freelancer.reputation.badges.map(badge => (
                    <div key={badge} className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                        <Award className="w-6 h-6 text-primary" />
                        <span className="font-semibold">{badge}</span>
                    </div>
                 ))}
                 <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                    <ShieldCheck className="w-6 h-6 text-green-500" />
                    <span className="font-semibold">Identity Verified</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
