import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deployer } = await getNamedAccounts();

  console.log({ deployer });

  const oldPact = '';
  const tokenReceiver = '';
  const operator = '';

  await deployments.deploy('PACTNewTokenDeployer', {
    contract: 'PACTNewTokenDeployer',
    from: deployer,
    args: [
      oldPact, // address _oldToken,
      tokenReceiver, // address _tokenReceiver,
      operator, // address _operator
    ],
    log: true,
    autoMine: true,
  });
};

export default func;
func.id = 'deploy_test'; // id required to prevent reexecution
func.tags = ['Test'];
