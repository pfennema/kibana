/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import moment from 'moment';
import { get } from 'lodash';
import { createQuery } from '../create_query';
import { LogstashMetric } from '../metrics';

export async function getLogstashPipelineIds(
  req,
  logstashIndexPattern,
  { clusterUuid, logstashUuid },
  size
) {
  const start = moment.utc(req.payload.timeRange.min).valueOf();
  const end = moment.utc(req.payload.timeRange.max).valueOf();

  const filters = [];
  if (logstashUuid) {
    filters.push({ term: { 'logstash_stats.logstash.uuid': logstashUuid } });
  }

  const params = {
    index: logstashIndexPattern,
    size: 0,
    ignoreUnavailable: true,
    filterPath: ['aggregations.nest.id.buckets', 'aggregations.nest_mb.id.buckets'],
    body: {
      query: createQuery({
        start,
        end,
        metric: LogstashMetric.getMetricFields(),
        clusterUuid,
        filters,
      }),
      aggs: {
        nest: {
          nested: {
            path: 'logstash_stats.pipelines',
          },
          aggs: {
            id: {
              terms: {
                field: 'logstash_stats.pipelines.id',
                size,
              },
              aggs: {
                unnest: {
                  reverse_nested: {},
                  aggs: {
                    nodes: {
                      terms: {
                        field: 'logstash_stats.logstash.uuid',
                        size,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        nest_mb: {
          nested: {
            path: 'logstash.node.stats.pipelines',
          },
          aggs: {
            id: {
              terms: {
                field: 'logstash.node.stats.pipelines.id',
                size,
              },
              aggs: {
                unnest_mb: {
                  reverse_nested: {},
                  aggs: {
                    nodes: {
                      terms: {
                        field: 'logstash.node.stats.logstash.uuid',
                        size,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  };

  const { callWithRequest } = req.server.plugins.elasticsearch.getCluster('monitoring');
  const response = await callWithRequest(req, 'search', params);
  return get(
    response,
    'aggregations.nest_mb.id.buckets',
    get(response, 'aggregations.nest.id.buckets', [])
  ).map((bucket) => ({
    id: bucket.key,
    nodeIds: get(bucket, 'unnest_mb.nodes.buckets', get(bucket, 'unnest.nodes.buckets', [])).map(
      (item) => item.key
    ),
  }));
}
