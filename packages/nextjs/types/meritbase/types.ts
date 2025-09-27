export type Profile = {
  address: string;
  name: string;
  pseudonym?: string;
  skills: string[];
  workCategories: string[];
  isActive: boolean;
  verified?: boolean; // employer verification flag
  license?: string; // license metadata or url
  createdAt: number;
};

export type Job = {
  id: string;
  employer: string; // address
  title: string;
  description: string;
  fee: number;
  venue?: string;
  date?: string; // ISO string
  requirements: string[];
  createdAt: number;
  status: "open" | "closed";
};

export type Application = {
  id: string;
  jobId: string;
  applicant: string; // address
  status: "pending" | "approved" | "declined";
  createdAt: number;
};
