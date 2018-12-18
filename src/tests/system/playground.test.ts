import * as path from 'path';
import { withKeystoreSigner } from '~/utils/environment/withKeystoreSigner';
import { constructEnvironment } from '~/utils/environment/constructEnvironment';
import { testLogger } from '../utils/testLogger';
import { getBalance } from '~/utils/evm/getBalance';
import { withNewAccount } from '~/utils/environment/withNewAccount';
import { toFixed, createQuantity } from '@melonproject/token-math/quantity';
import { sendEth } from '~/utils/evm/sendEth';

/**
 * TODO:
 * - [ ] Share logic between integration and system tests
 * - [x] Load wallet from keystore
 * - [x] Create new accounts and fund them (not use the keystore account to
 *       interact)
 */

describe('playground', () => {
  beforeAll(() => {
    expect(process.env).toHaveProperty('JSON_RPC_ENDPOINT');
    expect(process.env).toHaveProperty('KEYSTORE_PASSWORD');
    expect(process.env).toHaveProperty('KEYSTORE_FILE');
  });

  test('Happy path', async () => {
    const keystore = require(path.join(
      process.cwd(),
      process.env.KEYSTORE_FILE,
    ));

    const masterEnvironment = withKeystoreSigner(
      constructEnvironment({
        endpoint: process.env.JSON_RPC_ENDPOINT || 'http://localhost:8545',
        logger: testLogger,
      }),
      {
        keystore,
        password: process.env.KEYSTORE_PASSWORD,
      },
    );

    const environment = withNewAccount(masterEnvironment);

    const masterBalance = await getBalance(masterEnvironment);

    await sendEth(masterEnvironment, {
      howMuch: createQuantity('ETH', 1),
      to: environment.wallet.address,
    });

    const balance = await getBalance(environment);

    console.log(
      // process.env,
      process.cwd(),
      process.env.KEYSTORE_PASSWORD,
      process.env.KEYSTORE_FILE,
      process.env.JSON_RPC_ENDPOINT,
      toFixed(balance),
      toFixed(masterBalance),
      environment.wallet.address.toString(),
      '\n\n\n\n\n\n˙',
    );

    const a = 1;
    expect(a).toBe(1);
  });
});
