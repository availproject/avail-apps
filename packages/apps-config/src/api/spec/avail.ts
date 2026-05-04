// Copyright 2017-2025 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { OverrideBundleDefinition } from '@polkadot/types/types';

// structs need to be in order
/* eslint-disable sort-keys */

const definitions: OverrideBundleDefinition = {
  rpc: {
    blob: {
      submitBlob: {
        description: 'Submit a blob and its signed metadata transaction',
        params: [
          {
            name: 'metadata_signed_transaction',
            type: 'String'
          },
          {
            name: 'blob',
            type: 'String'
          }
        ],
        type: 'Null'
      },
      getBlob: {
        description: 'Get blob data by blob hash',
        params: [
          {
            name: 'blob_hash',
            type: 'H256'
          },
          {
            name: 'at',
            type: 'Hash',
            isOptional: true
          }
        ],
        type: 'Blob'
      },
      getBlobInfo: {
        description: 'Get blob inclusion and ownership information',
        params: [
          {
            name: 'blob_hash',
            type: 'H256'
          }
        ],
        type: 'BlobInfo'
      },
      inclusionProof: {
        description: 'Generate the inclusion proof for the given blob hash',
        params: [
          {
            name: 'blob_hash',
            type: 'H256'
          },
          {
            name: 'at',
            type: 'Hash',
            isOptional: true
          }
        ],
        type: 'DataProof'
      },
      getBlobsSummary: {
        description: 'Get included blob summaries for a block',
        params: [
          {
            name: 'at',
            type: 'Hash',
            isOptional: true
          }
        ],
        type: 'Vec<BlobSummary>'
      },
      getBlobsByAppId: {
        description: 'Get blob hashes for an AppId in a block',
        params: [
          {
            name: 'app_id',
            type: 'AppId'
          },
          {
            name: 'at',
            type: 'Hash',
            isOptional: true
          }
        ],
        type: 'Vec<H256>'
      },
      getEvalData: {
        description: 'Get FRI evaluation data for a blob',
        params: [
          {
            name: 'blob_hash',
            type: 'H256'
          },
          {
            name: 'at',
            type: 'Hash',
            isOptional: true
          }
        ],
        type: 'BlobEvalData'
      },
      getSamplingProof: {
        description: 'Get FRI sampling proofs for blob cells',
        params: [
          {
            name: 'cells',
            type: 'Vec<u32>'
          },
          {
            name: 'blob_hash',
            type: 'H256'
          },
          {
            name: 'at',
            type: 'Hash',
            isOptional: true
          }
        ],
        type: 'Vec<SamplingProof>'
      }
    },
    bridge: {
      queryDataProof: {
        description: 'Generate the data proof for the given `transaction_index`',
        params: [
          {
            name: 'transaction_index',
            type: 'u32'
          },
          {
            name: 'at',
            type: 'Hash',
            isOptional: true
          }
        ],
        type: 'ProofResponse'
      }
    }
  },
  types: [
    {
      // on all versions
      minmax: [0, undefined],
      types: {
        AppId: 'Compact<u32>',
        FriParamsVersion: {
          _enum: ['V0']
        },
        FriBlobCommitment: {
          blobHash: 'H256',
          sizeBytes: 'u64',
          commitment: 'Vec<u8>'
        },
        FriV1HeaderExtension: {
          blobs: 'Vec<FriBlobCommitment>',
          dataRoot: 'H256',
          paramsVersion: 'FriParamsVersion'
        },
        HeaderExtension: {
          _enum: {
            V1: 'FriV1HeaderExtension'
          }
        },
        DaHeader: {
          parentHash: 'Hash',
          number: 'Compact<BlockNumber>',
          stateRoot: 'Hash',
          extrinsicsRoot: 'Hash',
          digest: 'Digest',
          extension: 'HeaderExtension'
        },
        Header: 'DaHeader',
        CheckAppIdExtra: {
          appId: 'AppId'
        },
        CheckAppIdTypes: {},
        CheckAppId: {
          extra: 'CheckAppIdExtra',
          types: 'CheckAppIdTypes'
        },
        BlockLengthColumns: 'Compact<u32>',
        BlockLengthRows: 'Compact<u32>',
        BlockLength: {
          max: 'PerDispatchClass',
          cols: 'BlockLengthColumns',
          rows: 'BlockLengthRows',
          chunkSize: 'Compact<u32>'
        },
        PerDispatchClass: {
          normal: 'u32',
          operational: 'u32',
          mandatory: 'u32'
        },
        DataProof: {
          roots: 'TxDataRoots',
          proof: 'Vec<H256>',
          numberOfLeaves: 'Compact<u32>',
          leafIndex: 'Compact<u32>',
          leaf: 'H256'
        },
        TxDataRoots: {
          dataRoot: 'H256',
          blobRoot: 'H256',
          bridgeRoot: 'H256'
        },
        ProofResponse: {
          dataProof: 'DataProof',
          message: 'Option<AddressedMessage>'
        },
        AddressedMessage: {
          message: 'Message',
          from: 'H256',
          to: 'H256',
          originDomain: 'u32',
          destinationDomain: 'u32',
          id: 'u64'
        },
        Message: {
          _enum: {
            ArbitraryMessage: 'ArbitraryMessage',
            FungibleToken: 'FungibleToken'
          }
        },
        MessageType: {
          _enum: [
            'ArbitraryMessage',
            'FungibleToken'
          ]
        },
        FungibleToken: {
          assetId: 'H256',
          amount: 'String'
        },
        BoundedData: 'Vec<u8>',
        ArbitraryMessage: 'BoundedData',
        Blob: {
          blobHash: 'H256',
          data: 'Vec<u8>',
          size: 'u64'
        },
        OwnershipEntry: {
          address: 'AccountId32',
          babeKey: 'AuthorityId',
          encodedPeerId: 'String',
          signature: 'Vec<u8>'
        },
        BlobInfo: {
          hash: 'H256',
          blockHash: 'H256',
          blockNumber: 'u32',
          ownership: 'Vec<OwnershipEntry>'
        },
        BlobSummary: {
          hash: 'H256',
          txIndex: 'u32',
          appId: 'AppId',
          sizeBytes: 'u64'
        },
        BlobEvalData: {
          evalPointSeed: '[u8; 32]',
          evalClaim: '[u8; 16]',
          evalProof: 'Vec<u8>'
        },
        SamplingProof: {
          index: 'u32',
          cell: 'Vec<u8>',
          proof: 'Vec<u8>'
        },
        Cell: {
          row: 'BlockLengthRows',
          col: 'BlockLengthColumns'
        }
      }
    }
  ],
  signedExtensions: {
    CheckAppId: {
      extrinsic: {
        appId: 'AppId'
      },
      payload: {}
    }
  }
};

console.log('Add DA definitions');

export default definitions;
