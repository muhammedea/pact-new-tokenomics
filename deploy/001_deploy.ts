import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deployer } = await getNamedAccounts();

  console.log({ deployer });

  const oldPact = '0x46c9757c5497c5b1f2eb73ae79b6b67d119b0b58';

  await deployments.deploy('PACTNewTokenDeployer', {
    contract: 'PACTNewTokenDeployer',
    from: deployer,
    args: [oldPact],
    log: true,
    autoMine: true,
  });
};

export default func;
func.id = 'deploy_factory'; // id required to prevent reexecution
func.tags = ['Factory'];
