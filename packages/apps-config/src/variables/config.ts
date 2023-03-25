// [object Object]
// SPDX-License-Identifier: Apache-2.0

// eslint-disable-next-line header/header
// import { config } from 'dotenv';

// config({
//   path: '../../../../.env'
// });

// eslint-disable-next-line header/header
export default {
  LCURL: process.env.LCURL as string || 'https://testnet.avail.tools',
  TESTNETURL: process.env.TESTNETURL as string || 'wss://testnet.avail.tools/ws'
};
