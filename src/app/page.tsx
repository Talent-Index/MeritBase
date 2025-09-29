import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Bot, CodeXml, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <section className="w-full py-20 md:py-32 lg:py-40 bg-card/50">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline">
                    Own Your Professional Story. Work Without Borders.
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    MeritBase is where verified talent meets trusted opportunities. Build your on-chain reputation and connect with the best gigs, securely and transparently.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 transition-opacity">
                    <Link href="/signup-freelancer">
                      Join as a Freelancer <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="secondary">
                    <Link href="/signup-employer">
                      Join as an Employer <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative w-full max-w-md p-6 rounded-lg shadow-2xl bg-gradient-to-br from-primary/10 to-secondary/10">
                    <div className="absolute w-2/3 h-2/3 bg-primary/20 rounded-full -top-10 -left-10 animate-pulse"></div>
                    <div className="absolute w-1/2 h-1/2 bg-accent/20 rounded-full -bottom-10 -right-10 animate-pulse delay-75"></div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center transition-transform duration-500 hover:scale-105">
                        <ShieldCheck className="w-32 h-32 text-primary drop-shadow-[0_0_15px_hsl(var(--primary)/0.5)]" />
                        <p className="mt-4 text-muted-foreground font-semibold">Verifiable credentials for a fraud-free gig economy.</p>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm font-headline">Why Join MeritBase?</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">A Fairer, More Efficient Gig Economy</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  We leverage Web3 and AI to build a transparent marketplace where your reputation is your most valuable asset. No more recycled profiles, fake credentials, or platform lock-in. Just real talent and real opportunities.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-2 mt-12">
              <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
                <CardHeader>
                  <CardTitle className="font-headline text-2xl">For Freelancers: Own Your Merit</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground">
                  <p>
                    Stop building your reputation from scratch on every new platform. With MeritBase, your CVWallet is your permanent, portable professional identity. We help you create a secure, on-chain record of your skills and work history, verified by real clients and anchored to the blockchain. Our AI matches you with high-quality, fraud-free gigs that respect your expertise, so you can spend less time searching and more time earning.
                  </p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
                <CardHeader>
                  <CardTitle className="font-headline text-2xl">For Employers: Hire with Certainty</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground">
                   <p>
                    Eliminate the risk and overhead of hiring in a global market. MeritBase connects you with a pool of pre-vetted, high-integrity talent whose credentials are cryptographically verified. Our Sybil-resistant onboarding and on-chain reputation system mean you're hiring a real person with a proven track record. Use our AI-powered tools to instantly shortlist the most qualified candidates, saving you time and ensuring you find the perfect fit, faster.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
