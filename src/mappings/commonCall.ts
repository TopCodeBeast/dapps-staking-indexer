import { EraIndex } from "@polkadot/types/interfaces";
import { CallByEra } from "../types";
import { isRegisteredContract } from "./common";

export async function storeCall(toAddress: string): Promise<void> {
  // TODO validate if to address is dapps staking contract
  if (await isRegisteredContract(toAddress)) {
    const era = await api.query.dappsStaking.currentEra<EraIndex>();
    const id = `${era}_${toAddress}`;

    let record = await CallByEra.get(id);
    if (record) {
      record.numberOfCalls++;
    } else {
      record = new CallByEra(id);
      record.contractAddress = toAddress;
      record.numberOfCalls = BigInt(1);
      record.era = era.toBigInt();
    }

    await record.save();
  }
}
