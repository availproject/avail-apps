// Copyright 2017-2025 @polkadot/app-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment */

import type { AxiosError } from 'axios';
import type { HeaderExtended } from '@polkadot/api-derive/types';
import type { KeyedEvent } from '@polkadot/react-hooks/ctx/types';
import type { V2Weight } from '@polkadot/react-hooks/useWeight';
import type { EventRecord, RuntimeVersionPartial, SignedBlock } from '@polkadot/types/interfaces';

import axios from 'axios';
import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { AddressSmall, Columar, LinkExternal, MarkError, Table } from '@polkadot/react-components';
import { getExplorerLink } from '@polkadot/react-components/util';
import { useApi, useIsMountedRef } from '@polkadot/react-hooks';
import { convertWeight } from '@polkadot/react-hooks/useWeight';
import { settings } from '@polkadot/ui-settings';
import { formatNumber } from '@polkadot/util';

import { getLCFromUrl } from '../../../apps-config/src/variables/config.js';
import Events from '../Events.js';
import { useTranslation } from '../translate.js';
import Extrinsics from './Extrinsics.js';
import Justifications from './Justifications.js';
import Logs from './Logs.js';
import Summary from './Summary.js';

interface Props {
  className?: string;
  error?: Error | null;
  value?: string | null;
}

interface State {
  events?: KeyedEvent[] | null;
  getBlock?: SignedBlock;
  getHeader?: HeaderExtended;
  runtimeVersion?: RuntimeVersionPartial;
}

const EMPTY_HEADER: [React.ReactNode?, string?, number?][] = [['...', 'start', 6]];

function transformResult ([[runtimeVersion, events], getBlock, getHeader]: [[RuntimeVersionPartial, EventRecord[] | null], SignedBlock, HeaderExtended?]): State {
  return {
    events: events?.map((record, index) => ({
      indexes: [index],
      key: `${Date.now()}-${index}-${record.hash.toHex()}`,
      record
    })),
    getBlock,
    getHeader,
    runtimeVersion
  };
}

function BlockByHash ({ className = '', error, value }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api, apiUrl } = useApi();
  const mountedRef = useIsMountedRef();
  const [{ events, getBlock, getHeader, runtimeVersion }, setState] = useState<State>({});
  const [blkError, setBlkError] = useState<Error | null | undefined>(error);
  const [evtError, setEvtError] = useState<Error | null | undefined>();
  const [confidence, setConfidence] = useState<string>('0 %');

  const [isVersionCurrent, maxBlockWeight] = useMemo(
    () => [
      !!runtimeVersion && api.runtimeVersion.specName.eq(runtimeVersion.specName) && api.runtimeVersion.specVersion.eq(runtimeVersion.specVersion),
      api.consts.system.blockWeights && api.consts.system.blockWeights.maxBlock && convertWeight(api.consts.system.blockWeights.maxBlock).v2Weight
    ],
    [api, runtimeVersion]
  );

  useEffect((): void => {
    error && setBlkError(error);
  }, [error]);

  const systemEvents = useMemo(
    () => events?.filter(({ record: { phase } }) => !phase.isApplyExtrinsic),
    [events]
  );

  useEffect((): void => {
    value && Promise
      .all([
        api
          .at(value)
          .then((apiAt) =>
            Promise.all([
              Promise.resolve(apiAt.runtimeVersion),
              apiAt.query.system
                .events()
                .catch((error: Error) => {
                  mountedRef.current && setEvtError(error);

                  return null;
                })
            ])
          ),
        api.rpc.chain.getBlock(value),
        api.derive.chain.getHeader(value)
      ])
      .then((result): void => {
        mountedRef.current && setState(transformResult(result));

        const number = result[2]?.number.unwrap().toNumber();
        let LightClientURI = `${getLCFromUrl(settings.get().apiUrl)}/v1`;
        const url = new URL(window.location.href);
        const searchParams = new URLSearchParams(url.search);
        const getParam = searchParams.get('light');
        const savedLcUri = window.localStorage.getItem('lcUrl');

        if (getParam) {
          LightClientURI = getParam;
        } else if (savedLcUri !== null) {
          LightClientURI = savedLcUri;
        }

        console.log('Using Light Client at ', LightClientURI);

        axios.get(
          `blocks/${number}`,
          {
            baseURL: LightClientURI,
            headers: {
              'Content-Type': 'application/json'
            }
          }
        ).then((v) => {
          if (v.data.confidence !== null) {
            setConfidence((v.data.confidence as number).toFixed(4) + '%');
          } else if (v.data.status === 'incomplete') {
            setConfidence('No Blobs');
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          } else if (v.data.status?.includes('verifying')) {
            setConfidence(v.data.status);
          } else {
            setConfidence('ℹ️ Make sure Light Client runs on ' + LightClientURI);
          }
        }).catch((e: AxiosError) => {
          if (e.status === 404) {
            setConfidence('None');
          } else {
            setConfidence('ℹ️ Make sure Light Client runs on ' + LightClientURI);
            console.log('Light client: Called, but failed');
          }
        });
      })
      .catch((error: Error): void => {
        mountedRef.current && setBlkError(error);
      });
  }, [api, mountedRef, value]);

  const header = useMemo<[React.ReactNode?, string?, number?][]>(
    () => getHeader
      ? [
        [formatNumber(getHeader.number.unwrap()), 'start --digits', 1],
        [t('hash'), 'start'],
        [t('parent'), 'start'],
        [t('extrinsics'), 'start media--1300'],
        [t('state'), 'start media--1200'],
        [t('confidence'), 'start'],
        [runtimeVersion ? `${runtimeVersion.specName.toString()}/${runtimeVersion.specVersion.toString()}` : undefined, 'media--1000'],
        [t('explorer link'), 'start']
      ]
      : EMPTY_HEADER,
    [getHeader, runtimeVersion, t]
  );

  const blockNumber = getHeader?.number.unwrap();
  const parentHash = getHeader?.parentHash.toHex();
  const hasParent = !getHeader?.parentHash.isEmpty;

  return (
    <div className={className}>
      <Summary
        events={events}
        maxBlockWeight={(maxBlockWeight as V2Weight).refTime.toBn()}
        maxProofSize={(maxBlockWeight as V2Weight).proofSize.toBn()}
        signedBlock={getBlock}
      />
      <Table header={header}>
        {blkError
          ? (
            <tr>
              <td colSpan={6}>
                <MarkError content={t('Unable to retrieve the specified block details. {{error}}', { replace: { error: blkError.message } }) } />
              </td>
            </tr>
          )
          : getBlock && getHeader && !getBlock.isEmpty && !getHeader.isEmpty && (
            <tr>
              <td className='address'>
                {getHeader.author && (
                  <AddressSmall value={getHeader.author} />
                )}
              </td>
              <td className='hash overflow'>{getHeader.hash.toHex()}</td>
              <td className='hash overflow'>{
                hasParent
                  ? <Link to={`/explorer/query/${parentHash || ''}`}>{parentHash}</Link>
                  : parentHash
              }</td>
              <td className='hash overflow media--1300'>{getHeader.extrinsicsRoot.toHex()}</td>
              <td className='hash overflow media--1200'>{getHeader.stateRoot.toHex()}</td>
              <td className='hash overflow'>{confidence}</td>
              <td className='media--1000'>
                {value && (
                  <LinkExternal
                    data={value}
                    type='block'
                  />
                )}
              </td>
              <td className='media'>
                <a
                  href={getExplorerLink(getHeader.hash.toHex(), 'block', apiUrl)}
                  rel='noreferrer'
                  target={'_blank'}
                >View in explorer</a>
              </td>
            </tr>
          )
        }
      </Table>
      {getBlock && getHeader && (
        <>
          <Extrinsics
            blockNumber={blockNumber}
            events={events}
            maxBlockWeight={(maxBlockWeight as V2Weight).refTime.toBn()}
            value={getBlock.block.extrinsics}
            withLink={isVersionCurrent}
          />
          <Columar>
            <Columar.Column>
              <Events
                error={evtError}
                eventClassName='explorer--BlockByHash-block'
                events={systemEvents}
                label={t('system events')}
              />
            </Columar.Column>
            <Columar.Column>
              <Logs value={getHeader.digest.logs} />
              <Justifications value={getBlock.justifications} />
            </Columar.Column>
          </Columar>
        </>
      )}
    </div>
  );
}

export default React.memo(BlockByHash);
