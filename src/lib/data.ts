export type Freelancer = {
  id: string;
  name: string;
  title: string;
  avatar: string;
  skills: string[];
  cvWallet: string;
  reputation: {
    rating: number;
    reviews: number;
    badges: string[];
  };
};

export type Employer = {
  id: string;
  companyName: string;
  logo: string;
};

export type Job = {
  id: string;
  title: string;
  employerId: string;
  description: string;
  skills: string[];
  budget: number;
  postedAt: string;
};

export const freelancers: Freelancer[] = [
  {
    id: 'fl-1',
    name: 'Alice Johnson',
    title: 'Senior Frontend Developer',
    avatar: 'profile-1',
    skills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Web3'],
    cvWallet: `Seasoned Frontend Developer with over 8 years of experience specializing in React and Next.js. Proficient in building scalable and performant web applications. Passionate about Web3 technologies and decentralized applications. I have a strong eye for design and user experience. My portfolio includes e-commerce sites, complex dashboards, and dApps on the Ethereum blockchain. I am skilled in TypeScript, GraphQL, and modern CSS frameworks like Tailwind CSS.`,
    reputation: {
      rating: 4.9,
      reviews: 23,
      badges: ['Top Rated', 'React Expert'],
    },
  },
  {
    id: 'fl-2',
    name: 'Bob Williams',
    title: 'Smart Contract Engineer',
    avatar: 'profile-2',
    skills: ['Solidity', 'Hardhat', 'Polygon', 'IPFS', 'Node.js'],
    cvWallet: `Expert Smart Contract Engineer with a focus on security and efficiency. Experienced in developing, testing, and deploying smart contracts on EVM-compatible chains like Polygon. Proficient with Hardhat, Truffle, and OpenZeppelin. I have worked on DeFi protocols, NFT marketplaces, and DAO governance contracts. My backend skills include Node.js and Express for building robust dApp backends.`,
    reputation: {
      rating: 5.0,
      reviews: 15,
      badges: ['Security Pro', 'Solidity Master'],
    },
  },
];

export const employers: Employer[] = [
  {
    id: 'emp-1',
    companyName: 'DecentraCorp',
    logo: 'company-logo-1',
  },
  {
    id: 'emp-2',
    companyName: 'Innovate Solutions',
    logo: 'company-logo-2',
  },
];

export const jobs: Job[] = [
  {
    id: 'job-1',
    title: 'Lead Web3 Frontend Developer',
    employerId: 'emp-1',
    description: `We are looking for a Lead Frontend Developer to build the next generation of our decentralized finance platform. The ideal candidate will have extensive experience with React, Next.js, and interacting with smart contracts using libraries like ethers.js or viem. You will be responsible for leading the frontend team, architecting the application, and ensuring high-quality code. A strong understanding of blockchain principles and UI/UX design is crucial. You must be comfortable working in a fast-paced environment and collaborating with backend and smart contract developers.`,
    skills: ['React', 'Next.js', 'Ethers.js', 'Web3', 'TypeScript'],
    budget: 120000,
    postedAt: '2024-07-20T10:00:00Z',
  },
  {
    id: 'job-2',
    title: 'Solidity Developer for NFT Marketplace',
    employerId: 'emp-2',
    description: `Innovate Solutions is seeking a Solidity Developer to join our team building a new NFT marketplace on the Polygon network. You will be responsible for designing, developing, and deploying secure and optimized smart contracts for minting, trading, and royalty distribution. Experience with ERC-721 and ERC-1155 standards is required. The role also involves writing comprehensive tests and working with auditors to ensure contract security. Familiarity with IPFS for metadata storage is a big plus.`,
    skills: ['Solidity', 'Hardhat', 'Polygon', 'ERC-721', 'IPFS'],
    budget: 95000,
    postedAt: '2024-07-18T14:30:00Z',
  },
  {
    id: 'job-3',
    title: 'Full-Stack dApp Developer',
    employerId: 'emp-1',
    description: `DecentraCorp needs a versatile Full-Stack dApp Developer to work on various projects. This role requires proficiency in both frontend (React) and backend (Node.js) development, as well as a solid understanding of smart contract integration. You'll be building user interfaces, creating server-side APIs, and connecting them to our on-chain logic. Experience with PostgreSQL for off-chain data management is highly desirable.`,
    skills: ['React', 'Node.js', 'Solidity', 'PostgreSQL', 'Web3'],
    budget: 110000,
    postedAt: '2024-07-21T09:00:00Z',
  },
];
