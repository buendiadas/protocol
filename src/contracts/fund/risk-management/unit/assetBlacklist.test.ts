import { deployAndGetContract as deploy } from '~/utils/solidity';
import { deployMockSystem } from '~/utils';
import { Contracts } from '~/Contracts';
import { initTestEnvironment } from '~/utils/environment';
import { randomAddress } from '~/utils/helpers';
import { emptyAddress } from '~/utils/constants';
import * as Web3Utils from 'web3-utils';

let shared: any = {};

beforeAll(async () => {
  shared.env = await initTestEnvironment();
  shared = Object.assign(shared, await deployMockSystem());
  shared.user = shared.env.wallet.address;
  await shared.version.methods
    .setIsFund(shared.participation.options.address)
    .send({ from: shared.user });
  shared.opts = { from: shared.user, gas: 8000000 };
  shared.testBlacklist = Web3Utils.sha3('func()').substring(0, 10);
  shared.assetArray = [
    `${randomAddress()}`,
    `${randomAddress()}`,
    `${randomAddress()}`,
    `${randomAddress()}`,
    `${randomAddress()}`,
  ];
});

test('Create blacklist', async () => {
  const blacklist = await deploy(Contracts.AssetBlacklist, [shared.assetArray]);

  expect(await blacklist.methods.getMembers().call()).toEqual(
    shared.assetArray,
  );
});

test('Add asset to blacklist', async () => {
  const blacklist = await deploy(Contracts.AssetBlacklist, [shared.assetArray]);
  const mockAsset = `${randomAddress()}`;

  expect(await blacklist.methods.getMembers().call()).toEqual(
    shared.assetArray,
  );
  await expect(
    blacklist.methods
      .addToBlacklist(shared.assetArray[0])
      .send({ from: shared.user }),
  ).rejects.toThrow('Asset already in blacklist');
  expect(await blacklist.methods.getMembers().call()).toEqual(
    shared.assetArray,
  );
  await expect(
    blacklist.methods.addToBlacklist(mockAsset).send({ from: shared.user }),
  ).resolves.not.toThrow();
  expect(await blacklist.methods.isMember(mockAsset).call()).toBe(true);
});

test('Policy manager with blacklist', async () => {
  const blacklist = await deploy(Contracts.AssetBlacklist, [shared.assetArray]);
  const manager = await deploy(Contracts.PolicyManager, [emptyAddress]);
  const mockAsset = `${randomAddress()}`;
  await manager.methods
    .register(shared.testBlacklist, blacklist.options.address)
    .send({ from: shared.user });

  const validateArgs = [
    shared.testBlacklist,
    [emptyAddress, emptyAddress, emptyAddress, mockAsset, emptyAddress],
    [0, 0, 0],
    '0x0',
  ];
  await expect(
    manager.methods.preValidate(...validateArgs).call(),
  ).resolves.not.toThrow();

  await blacklist.methods.addToBlacklist(mockAsset).send({ from: shared.user });

  expect(await blacklist.methods.isMember(mockAsset).call()).toBe(true);
  await expect(
    manager.methods.preValidate(...validateArgs).call(),
  ).rejects.toThrow('Rule evaluated to false');
});
