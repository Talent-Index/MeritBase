import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Database, FileText, Fingerprint, Lock, Scale, Telescope } from "lucide-react";

const architecturePoints = [
  {
    icon: Fingerprint,
    title: "On-Chain Storage (Polygon)",
    subtitle: "The Source of Truth",
    description: "The blockchain is used for what it does best: providing an immutable, publicly verifiable ledger. We only store minimal, high-integrity data like registry entries (who is a verified freelancer/employer), cryptographic hashes (proofs) of CVs, and event logs. Raw files are never stored on-chain.",
    tags: ["Hashes", "Attestations", "Registry Entries", "Events"],
  },
  {
    icon: FileText,
    title: "Off-Chain Decentralized Storage (IPFS/Filecoin)",
    subtitle: "Secure & Portable Data",
    description: "Documents like CVs, government IDs, and portfolios are encrypted on the user's device (client-side) before being pinned to IPFS. The smart contract only references the content identifier (CID). This keeps sensitive data private and portable while ensuring it's securely stored in a decentralized manner.",
    tags: ["Client-Side Encryption", "IPFS CIDs", "Data Portability"],
  },
  {
    icon: Database,
    title: "Database / Indexer Storage (PostgreSQL)",
    subtitle: "Performance & Search",
    description: "A traditional database is used for data that requires fast queries, searching, and indexing. This includes user profiles, job listings, search indices, and AI model embeddings for our matching engine. The database acts as a performant layer that can be rebuilt from on-chain events, always treating the blockchain as the ultimate source of truth.",
    tags: ["Fast Queries", "AI Embeddings", "Caching", "Search Index"],
  },
  {
    icon: Lock,
    title: "Encryption & Privacy",
    subtitle: "User-Controlled Data",
    description: "Sensitive documents are encrypted client-side using AES-GCM before upload. This means MeritBase servers never have access to your unencrypted private files. Only cryptographic proofs (hashes and CIDs) are public, ensuring your privacy is paramount.",
    tags: ["AES-GCM Encryption", "Data Minimization", "Privacy-by-Design"],
  },
  {
    icon: CheckCircle,
    title: "Verification & Immutability",
    subtitle: "Anchoring Trust",
    description: "To prevent tampering, a keccak256 hash of your CV's metadata is calculated and stored on-chain. This creates a permanent, timestamped anchor. Anyone can independently verify the authenticity of a CV by hashing the file and comparing it to the on-chain proof, ensuring the document hasn't been altered.",
    tags: ["keccak256 Hash", "Integrity Check", "Timestamping"],
  },
  {
    icon: Scale,
    title: "Scalability & Cost-Efficiency",
    subtitle: "The Hybrid Advantage",
    description: "Storing large files on-chain is prohibitively expensive and slow. Our hybrid model is designed for efficiency. It minimizes gas fees by only storing small proofs on Polygon, leverages the low cost of IPFS for file storage, and uses a database for high-speed application performance. This provides the best of all worlds: decentralization, security, and a great user experience.",
    tags: ["Low Gas Fees", "High Performance", "Decentralized Security"],
  },
  {
    icon: Telescope,
    title: "Future Extensions",
    subtitle: "Building on the Foundation",
    description: "This architecture is built to evolve. Future enhancements could include using The Graph for more complex event indexing, Arweave for permanent, one-time-fee storage of critical documents, and ZK-proofs to enable privacy-preserving attestations where you can prove something (e.g., 'I am verified') without revealing the underlying data.",
    tags: ["The Graph", "Arweave", "ZK-Proofs", "Privacy Tech"],
  }
];


export default function ArchitecturePage() {
  return (
    <div className="bg-background">
      <main className="container mx-auto max-w-5xl py-12 md:py-20 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline">
            MeritBase Data Architecture
          </h1>
          <p className="mt-4 max-w-3xl mx-auto text-muted-foreground md:text-xl">
            A hybrid model for security, performance, and decentralization. We combine the strengths of on-chain, off-chain, and traditional storage to build a trustworthy and efficient platform.
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
