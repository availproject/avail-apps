// Copyright 2017-2025 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0
// eslint-disable-next-line
const config: { [network: string]: { url: `wss://${string}`, lcUrl: string } } = {
  mainnet: {
    lcUrl: process.env.MAINNET_LC || 'https://api.lightclient.mainnet.avail.so/v2',
    url: process.env.MAINNET_URL as `wss://${string}` || 'wss://mainnet-rpc.avail.so/ws'
  },
  turing: {
    lcUrl: process.env.TURING_LC || 'https://api.lightclient.turing.avail.so/v2',
    url: process.env.TURING_URL as `wss://${string}` || 'wss://turing-rpc.avail.so/ws'
  }
};

export const getLCFromUrl = (apiUrl: string) => {
  if (apiUrl.includes('turing')) {
    return config.turing.lcUrl;
  } else {
    return config.mainnet.lcUrl;
  }
};

export default config;
