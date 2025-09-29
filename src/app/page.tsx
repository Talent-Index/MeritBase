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
                    Decentralized Talent, Verifiable Merit.
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    MeritBase is the future of freelance work. Connect with top talent or find your next gig on a secure, transparent, and AI-powered platform.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Link href="/signup-freelancer">
                      Find Work <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="secondary">
                    <Link href="/signup-employer">
                      Hire Talent <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative w-full max-w-md p-6 rounded-lg shadow-2xl bg-gradient-to-br from-primary/10 to-secondary/10">
                    <div className="absolute w-2/3 h-2/3 bg-primary/20 rounded-full -top-10 -left-10 animate-pulse"></div>
                    <div className="absolute w-1/2 h-1/2 bg-accent/20 rounded-full -bottom-10 -right-10 animate-pulse delay-75"></div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center transition-transform duration-500 hover:scale-105">
                        <Bot className="w-32 h-32 text-primary drop-shadow-[0_0_15px_hsl(var(--primary)/0.5)]" />
                        <p className="mt-4 text-muted-foreground font-semibold">AI-powered matching connecting you with the perfect opportunity.</p>
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
                <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">Key Features</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Why MeritBase?</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  We leverage Web3 and AI to create a fairer, more efficient gig economy for everyone.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 mt-12">
              <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
                <CardHeader>
                  <div className="p-3 rounded-full bg-primary/10 inline-block mb-4">
                    <ShieldCheck className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="font-headline">Verified CVWallet</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Build your on-chain reputation. Your skills and work history are verified and stored securely on IPFS, giving employers confidence in your abilities.</p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
                <CardHeader>
                  <div className="p-3 rounded-full bg-primary/10 inline-block mb-4">
                     <Zap className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="font-headline">AI-Powered Matching</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Our intelligent matching engine analyzes job requirements and your CVWallet to find the perfect fit, saving you time and effort in your job search.</p>
                </CardContent>
              </Card>
               <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
                <CardHeader>
                   <div className="p-3 rounded-full bg-primary/10 inline-block mb-4">
                     <CodeXml className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="font-headline">Decentralized & Transparent</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Built on Polygon, MeritBase offers a decentralized platform where trust is built-in. All transactions and reviews are recorded on the blockchain.</p>
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
