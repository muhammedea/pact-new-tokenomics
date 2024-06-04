import { getNamedAccounts, ethers, deployments } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { PACTConvert } from '../typechain';
import exec from '../utils/exec';
import csvReader from 'csv-reader';
import fs from 'fs';

interface SignatureData {
  amount: string;
  signature: string;
}
interface AccountData {
  account: string;
  amount: string;
}

async function main() {
  const { deployer, signerAccount } = await getNamedAccounts();

  console.log({ signerAccount });

  const idoContract: PACTConvert = await ethers.getContract('TESTConvert', deployer);
  const seed = await idoContract.SEED();
  console.log(seed);

  return new Promise<void>((resolve, reject) => {
    const inputStream = fs.createReadStream('temp/whitelist.csv', 'utf8');

    const accounts: AccountData[] = [];
    inputStream
      .pipe(new csvReader({ parseNumbers: true, parseBooleans: true, trim: true }))
      .on('data', function (row: string[]) {
        if (row.length > 1 && row[0].startsWith('0x')) {
          accounts.push({
            account: row[0],
            amount: row[1],
          });
        }
      })
      .on('end', async function () {
        await generateSignatures(seed, accounts, await ethers.getNamedSigner('signerAccount'));
        resolve();
      })
      .on('error', function (err) {
        console.log(err);
        reject(err);
      });
  });
}

async function generateSignatures(
  seed: string,
  accounts: AccountData[],
  signer: SignerWithAddress
) {
  const wihiteList: { [key: string]: SignatureData } = {};
  for (let i = 0; i < accounts.length; i++) {
    //seed, account, amount
    const amount = ethers.utils.parseEther(accounts[i].amount + '').toString();
    const hash = ethers.utils.solidityKeccak256(
      ['bytes32', 'address', 'uint256'],
      [seed, accounts[i].account, amount]
    );
    const messageHashBytes = ethers.utils.arrayify(hash);
    const sig = await signer.signMessage(messageHashBytes);
    wihiteList[accounts[i].account.toLowerCase()] = {
      amount: amount,
      signature: sig,
    };
  }

  fs.writeFileSync('temp/whitelist.json', JSON.stringify(wihiteList));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
