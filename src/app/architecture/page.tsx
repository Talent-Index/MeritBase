import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Database, FileText, Fingerprint, Lock, Scale, Telescope, Bot, Cloud } from "lucide-react";

const architecturePoints = [
  {
    icon: Fingerprint,
    title: "On-Chain Storage (Polygon Amoy)",
    subtitle: "The Source of Truth on a Testnet",
    description: "We use the Polygon Amoy testnet for our smart contracts. It's free to use but functions exactly like the mainnet. We only store essential, high-integrity data: keccak256 hashes of CVs, registry entries for freelancers/employers, and event logs. Storing only small proofs (hashes) instead of raw files keeps gas costs zero on the testnet and minimal on mainnet, ensuring the blockchain is used for its core strength: immutable verification.",
    tags: ["Polygon Amoy", "keccak256 Hashes", "Registry Entries", "Free Gas"],
  },
  {
    icon: FileText,
    title: "Off-Chain Storage (Free IPFS)",
    subtitle: "Secure & Decentralized File Hosting",
    description: "Documents like CVs and government IDs are encrypted on your device (client-side) before being pinned to IPFS via free services like Web3.Storage or Pinata's free tier. The smart contract only stores the content identifier (CID). This keeps sensitive data private and leverages the power of decentralized storage without cost, ensuring your files are secure and censorship-resistant.",
    tags: ["Client-Side Encryption", "Web3.Storage", "IPFS CIDs", "$0 Cost"],
  },
  {
    icon: Database,
    title: "Database Cache (Supabase Free Tier)",
    subtitle: "Performance & Search on a Budget",
    description: "A free-tier PostgreSQL database from Supabase is used for data that needs fast queries, like user profiles, job listings, and search indexes. This layer acts as a performant cache that can be rebuilt from on-chain events, treating the blockchain as the ultimate source of truth. This hybrid model gives us high-speed performance for the app's UI without compromising on decentralization.",
    tags: ["Supabase (Free)", "PostgreSQL", "Fast Queries", "Caching Layer"],
  },
  {
    icon: Lock,
    title: "Encryption & Privacy-First",
    subtitle: "User-Controlled Data Security",
    description: "Your sensitive documents are encrypted client-side using the robust AES-GCM algorithm before they ever leave your browser. This means MeritBase servers never see your unencrypted files. Only the resulting cryptographic proofs (hashes and CIDs) are made public, ensuring your privacy is maintained by default.",
    tags: ["AES-GCM Encryption", "Zero-Knowledge", "Privacy-by-Design"],
  },
  {
    icon: CheckCircle,
    title: "Verification & Immutability",
    subtitle: "Anchoring Trust On-Chain",
    description: "To prevent tampering, a keccak256 hash of your CV's metadata is calculated and stored on-chain. This creates a permanent, timestamped anchor. Anyone can independently verify a CV's authenticity by hashing the file and comparing it to the on-chain proof, ensuring the document is legitimate and unaltered.",
    tags: ["keccak256 Hash", "Integrity Check", "Timestamping"],
  },
  {
    icon: Scale,
    title: "Scalability & Cost-Efficiency",
    subtitle: "The Bootstrapper's Advantage",
    description: "This hybrid model is designed for maximum efficiency on a zero budget. It leverages free testnet transactions, free IPFS pinning, and free-tier databases. This provides the best of all worlds for an MVP: the security of decentralization, high performance for a great user experience, and zero operational costs, allowing us to scale the user base before needing to upgrade infrastructure.",
    tags: ["$0 MVP", "High Performance", "Scalable Design"],
  },
  {
    icon: Bot,
    title: "AI Matching (HuggingFace Free Tier)",
    subtitle: "Intelligent Matching, No Cost",
    description: "We use free-tier sentence transformer models from HuggingFace to create vector embeddings for job descriptions and freelancer CVs. By calculating the cosine similarity between these embeddings, we can generate a highly relevant 'fit score' and shortlist the best candidates for a role—all without the cost of a dedicated AI service.",
    tags: ["HuggingFace", "Embeddings", "Cosine Similarity", "Free AI"],
  },
  {
    icon: Cloud,
    title: "Hosting (Vercel & Render)",
    subtitle: "Globally Distributed Frontend & Backend",
    description: "The Next.js frontend is hosted on Vercel's generous free tier, providing a global CDN, automatic scaling, and CI/CD. The backend API routes are deployed on Render's free tier, which is perfect for handling our off-chain logic like IPFS pinning and AI matching. This stack is powerful, scalable, and completely free to start.",
    tags: ["Vercel", "Render", "Serverless", "Free Hosting"],
  },
  {
    icon: Telescope,
    title: "Future-Proof Architecture",
    subtitle: "Building on a Strong Foundation",
    description: "This architecture is built to evolve. As MeritBase grows, we can seamlessly transition from testnet to Polygon mainnet, upgrade our database and IPFS plans, and integrate more advanced tools like The Graph for indexing, Arweave for permanent storage, or ZK-proofs for privacy-preserving attestations without needing to re-architect the core logic.",
    tags: ["The Graph", "Arweave", "ZK-Proofs", "Evolvable"],
  }
];


export default function ArchitecturePage() {
  return (
    <div className="bg-background">
      <main className="container mx-auto max-w-5xl py-12 md:py-20 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline">
            MeritBase Architecture: A $0-Budget Web3 MVP
          </h1>
          <p className="mt-4 max-w-3xl mx-auto text-muted-foreground md:text-xl">
            How we built a secure, decentralized, and scalable platform with a real Web3 feel on a zero-dollar budget. This hybrid model combines the strengths of on-chain proofs, decentralized storage, and free-tier cloud services.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {architecturePoints.map((point) => {
                const Icon = point.icon;
                return (
                    <Card key={point.title} className="flex flex-col hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10">
                        <CardHeader>
                            <div className="flex items-center gap-4 mb-2">
                                <div className="p-2 bg-primary/10 rounded-md">
                                    <Icon className="w-6 h-6 text-primary" />
                                </div>
                                <CardTitle className="text-lg font-headline leading-tight">{point.title}</CardTitle>
                            </div>
                             <p className="font-semibold text-primary">{point.subtitle}</p>
                        </CardHeader>
                        <CardContent className="flex-1 flex flex-col justify-between">
                            <p className="text-muted-foreground text-sm mb-4">{point.description}</p>
                            <div className="flex flex-wrap gap-2">
                                {point.tags.map(tag => (
                                <Badge key={tag} variant="secondary">{tag}</Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )
            })}
        </div>
      </main>
    </div>
  );
}
