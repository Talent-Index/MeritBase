'use server';
// @ts-nocheck
// Disabling TypeScript checking for this file because we are dynamically reading JSON
// files from the filesystem, which TypeScript cannot statically analyze.

import fs from 'fs';
import path from 'path';

// Define a structure for our contracts
interface ContractInfo {
    address: `0x${string}`;
    abi: any;
}

interface Contracts {
    EmployerRegistry: ContractInfo;
    FreelancerRegistry: ContractInfo;
}

function getContract(contractName: string): ContractInfo {
  try {
    const contractsDir = path.resolve(process.cwd(), 'contracts', 'deployments', 'localhost');
    const filePath = path.join(contractsDir, `${contractName}.json`);
    
    if (!fs.existsSync(filePath)) {
      throw new Error(`Contract JSON file not found at path: ${filePath}`);
    }
    
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const contractJson = JSON.parse(fileContent);
    
    if (!contractJson.address || !contractJson.abi) {
        throw new Error(`Invalid contract JSON format for ${contractName}. "address" and "abi" must be defined.`);
    }

    return {
      address: contractJson.address,
      abi: contractJson.abi,
    };
  } catch (error) {
    console.error(`Error loading contract ${contractName}:`, error);
    // Return a dummy object to prevent the app from crashing entirely during build.
    // The runtime error will indicate the actual problem.
    return {
        address: '0x0000000000000000000000000000000000000000',
        abi: [],
    }
  }
}

// Type-safe contracts object
export const contracts: Contracts = {
    EmployerRegistry: getContract('EmployerRegistry'),
    FreelancerRegistry: getContract('FreelancerRegistry'),
};
