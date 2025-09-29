import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deployYourContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  await deploy("FreelancerRegistry", {
    from: deployer,
    log: true,
    autoMine: true,
  });
  
  await deploy("EmployerRegistry", {
    from: deployer,
    log: true,
    autoMine: true,
  });
};

export default deployYourContract;

deployYourContract.tags = ["FreelancerRegistry", "EmployerRegistry"];
