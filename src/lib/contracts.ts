
import EmployerRegistry from 'contracts/deployments/localhost/EmployerRegistry.json';
import FreelancerRegistry from 'contracts/deployments/localhost/FreelancerRegistry.json';

// Utility type to extract ABI
type ContractAbi<T> = T extends { abi: infer U } ? U : never;

// Define a structure for our contracts
interface ContractInfo {
    address: `0x${string}`;
    abi: any; // Using 'any' for ABI as it's a complex array of objects
}

interface Contracts {
    EmployerRegistry: ContractInfo;
    FreelancerRegistry: ContractInfo;
}

// Type-safe contracts object
export const contracts: Contracts = {
    EmployerRegistry: {
        address: EmployerRegistry.address as `0x${string}`,
        abi: EmployerRegistry.abi as ContractAbi<typeof EmployerRegistry>,
    },
    FreelancerRegistry: {
        address: FreelancerRegistry.address as `0x${string}`,
        abi: FreelancerRegistry.abi as ContractAbi<typeof FreelancerRegistry>,
    },
};
