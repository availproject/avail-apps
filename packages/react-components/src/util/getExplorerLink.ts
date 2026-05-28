// Copyright 2017-2026 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

export const getExplorerLink = (suffix: string, mode: 'account' | 'block' | 'extrinsic', apiUrl: string | undefined) => {
  return (apiUrl?.toLowerCase().includes('turing') ? 'https://avail-turing.subscan.io/' : 'https://avail.subscan.io/') + mode + '/' + suffix;
};
