import {
  QuantityInterface,
  createQuantity,
} from '@melonproject/token-math/quantity';
import { callFactory } from '~/utils/solidity';
import { Contracts } from '~/Contracts';
import { getToken } from '~/contracts/dependencies/token';
import { create } from 'domain';
import { URLSearchParams } from 'url';

const prepareArgs = ({ id }) => [id];
const postProcess = async (result, prepared, environment) => {
  const sellToken = await getToken(result['1']);
  const buyToken = await getToken(result['3']);
  return {
    id: prepared.txObject.arguments[0],
    sell: createQuantity(sellToken, result['0']),
    buy: createQuantity(buyToken, result['2']),
  };
};

const getOasisDexOrder = callFactory('getOffer', Contracts.MatchingMarket, {
  postProcess,
  prepareArgs,
});

export { getOasisDexOrder };
