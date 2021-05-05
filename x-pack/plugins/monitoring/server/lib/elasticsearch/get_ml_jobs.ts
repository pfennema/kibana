/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { includes } from 'lodash';
// @ts-ignore
import { checkParam } from '../error_missing_required';
// @ts-ignore
import { createQuery } from '../create_query';
// @ts-ignore
import { ElasticsearchMetric } from '../metrics';
import { ML_SUPPORTED_LICENSES } from '../../../common/constants';
import { ElasticsearchResponse, ElasticsearchSource } from '../../../common/types/es';
import { LegacyRequest } from '../../types';

/*
 * Get a listing of jobs along with some metric data to use for the listing
 */
export function handleResponse(response: ElasticsearchResponse) {
  const hits = response.hits?.hits;
  return (
    hits?.map((hit) => {
      const job = hit._source.job_stats ?? hit._source.elasticsearch;
      return {
        ...job,
        node: {
          ...job?.node,
          name: job?.node?.name ?? job?.node?.id,
        },
      };
    }) ?? []
  );
}

export function getMlJobs(req: LegacyRequest, esIndexPattern: string) {
  checkParam(esIndexPattern, 'esIndexPattern in getMlJobs');

  const config = req.server.config();
  const maxBucketSize = config.get('monitoring.ui.max_bucket_size');
  const start = req.payload.timeRange.min; // no wrapping in moment :)
  const end = req.payload.timeRange.max;
  const clusterUuid = req.params.clusterUuid;
  const metric = ElasticsearchMetric.getMetricFields();
  const params = {
    index: esIndexPattern,
    size: maxBucketSize,
    ignoreUnavailable: true,
    filterPath: [
      'hits.hits._source.job_stats.job_id',
      'hits.hits._source.elasticsearch.ml.job.id',
      'hits.hits._source.job_stats.state',
      'hits.hits._source.elasticsearch.ml.job.state',
      'hits.hits._source.job_stats.data_counts.processed_record_count',
      'hits.hits._source.elasticsearch.ml.job.data_counts.processed_record_count',
      'hits.hits._source.job_stats.model_size_stats.model_bytes',
      'hits.hits._source.elasticsearch.ml.job.model_size_stats.model_bytes',
      'hits.hits._source.job_stats.forecasts_stats.total',
      'hits.hits._source.elasticsearch.ml.job.forecasts_stats.total',
      'hits.hits._source.job_stats.node.id',
      'hits.hits._source.elasticsearch.node.id',
      'hits.hits._source.job_stats.node.name',
      'hits.hits._source.elasticsearch.node.name',
    ],
    body: {
      sort: { timestamp: { order: 'desc', unmapped_type: 'long' } },
      collapse: { field: 'job_stats.job_id' },
      query: createQuery({ types: ['ml_job', 'job_stats'], start, end, clusterUuid, metric }),
    },
  };

  const { callWithRequest } = req.server.plugins.elasticsearch.getCluster('monitoring');
  return callWithRequest(req, 'search', params).then(handleResponse);
}

/*
 * cardinality isn't guaranteed to be accurate is the issue
 * but it will be as long as the precision threshold is >= the actual value
 */
export function getMlJobsForCluster(
  req: LegacyRequest,
  esIndexPattern: string,
  cluster: ElasticsearchSource
) {
  const license = cluster.license ?? cluster.elasticsearch?.cluster?.stats?.license ?? {};

  if (license.status === 'active' && includes(ML_SUPPORTED_LICENSES, license.type)) {
    // ML is supported
    const start = req.payload.timeRange.min; // no wrapping in moment :)
    const end = req.payload.timeRange.max;
    const clusterUuid = req.params.clusterUuid;
    const metric = ElasticsearchMetric.getMetricFields();
    const params = {
      index: esIndexPattern,
      size: 0,
      ignoreUnavailable: true,
      filterPath: 'aggregations.jobs_count.value',
      body: {
        query: createQuery({ types: ['ml_job', 'job_stats'], start, end, clusterUuid, metric }),
        aggs: {
          jobs_count: { cardinality: { field: 'job_stats.job_id' } },
        },
      },
    };

    const { callWithRequest } = req.server.plugins.elasticsearch.getCluster('monitoring');

    return callWithRequest(req, 'search', params).then((response: ElasticsearchResponse) => {
      return response.aggregations.jobs_count.value ?? 0;
    });
  }

  // ML is not supported
  return Promise.resolve(null);
}
