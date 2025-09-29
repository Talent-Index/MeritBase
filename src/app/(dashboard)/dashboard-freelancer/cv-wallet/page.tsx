import { CVWallet } from "@/components/dashboard/cv-wallet";
import { freelancers } from "@/lib/data";

export default function CVWalletPage() {
    const freelancer = freelancers[0];

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold tracking-tight font-headline">Manage Your CVWallet</h2>
                <p className="text-muted-foreground">This is your decentralized professional identity. Keep it up-to-date to attract the best gigs.</p>
            </div>
            <CVWallet initialContent={freelancer.cvWallet} />
        </div>
    )
}
