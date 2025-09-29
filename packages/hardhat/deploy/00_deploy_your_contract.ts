import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

/**
 * Deploys the Meritbase gig platform registry and job contracts.
 */
const deployMeritbaseCore: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy, log } = hre.deployments;

  log("Deploying FreelancerRegistry...");
  const freelancerRegistry = await deploy("FreelancerRegistry", {
    from: deployer,
    args: [deployer],
    log: true,
    autoMine: true,
  });

  log("Deploying EmployerRegistry...");
  const employerRegistry = await deploy("EmployerRegistry", {
    from: deployer,
    args: [deployer],
    log: true,
    autoMine: true,
  });

  log("Deploying JobContract...");
  await deploy("JobContract", {
    from: deployer,
    args: [deployer, freelancerRegistry.address, employerRegistry.address],
    log: true,
    autoMine: true,
  });

  log(`FreelancerRegistry deployed at ${freelancerRegistry.address}`);
  log(`EmployerRegistry deployed at ${employerRegistry.address}`);
  log("Meritbase core contracts deployed");
};

export default deployMeritbaseCore;

deployMeritbaseCore.tags = ["meritbase-core"];