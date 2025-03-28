// Copyright 2017-2025 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HexString } from '@polkadot/util/types';

import { knownGenesis } from '@polkadot/networks/defaults';
import { assert, BN } from '@polkadot/util';

export function getGenesis (name: string): HexString {
  const network = Object.entries(knownGenesis).find(([network]) => network === name);

  assert(network?.[1][0], `Unable to find genesisHash for ${name}`);

  return network[1][0];
}

export const KULUPU_GENESIS = getGenesis('kulupu');

export const KUSAMA_GENESIS = getGenesis('kusama');

export const POLKADOT_GENESIS = getGenesis('polkadot');
export const POLKADOT_DENOM_BLOCK = new BN(1248328);

export const PASEO_GENESIS = '0x77afd6190f1554ad45fd0d31aee62aacc33c6db0ea801129acb813f913e0764f';

export const WESTEND_GENESIS = getGenesis('westend');

export const NEATCOIN_GENESIS = '0xfbb541421d30423c9a753ffa844b64fd44d823f513bf49e3b73b3a656309a595';

export const DOCK_GENESIS = '0x6bfe24dca2a3be10f22212678ac13a6446ec764103c0f3471c71609eac384aae';

export const DOCK_POS_TESTNET_GENESIS = '0x59d93e2ce42abb8aa52ca9a9e820233667104751f8f2980578a47a26a7235027';

export const NFTMART_GENESIS = '0xfcf9074303d8f319ad1bf0195b145871977e7c375883b834247cb01ff22f51f9';

export const CERE_NETWORK_GENESIS = '0x81443836a9a24caaa23f1241897d1235717535711d1d3fe24eae4fdc942c092c';

export const CERE_NETWORK_TESTNET_GENESIS = '0x42b9b44b4950b6c1edae543a7696caf8d0a160e9bc0424ab4ab217f7a8ba30dc';

export const AVAIL_NETWORK_GENESIS = '0xb91746b45e0346cc2f815a520b9c6cb4d5c0902af848db0a80f85932d2e8276a';

export const TURING_NETWORK_TESTNET_GENESIS = '0xd3d2f3a3495dc597434a99d7d449ebad6616db45e4e4f178f31cc6fa14378b70';

export const HEX_AVAIL_DEVNET_GENESIS = '0x9d5ea6a5d7631e13028b684a1a0078e3970caa78bd677eaecaf2160304f174fb';

export const VARA_NETWORK_GENESIS = '0xfe1b4c55fd4d668101126434206571a7838a8b6b93a6d1b95d607e78e6c53763';

export const VARA_NETWORK_TESTNET_GENESIS = '0x525639f713f397dcf839bd022cd821f367ebcf179de7b9253531f8adbe5436d6';

export const JOYSTREAM_GENESIS = '0x6b5e488e0fa8f9821110d5c13f4c468abcd43ce5e297e62b34c53c3346465956';
