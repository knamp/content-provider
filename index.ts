import { merge } from "lodash";
import ConfigInterface from "./lib/interfaces/ConfigInterface";
import WebServer from "./lib/WebServer";

const defaultOptions = {
  consumeWithBackpressure: true,
  kafkaHost: "127.0.0.1:9092",
  options: {
    ackTimeoutMs: 100,
    autoCommit: true,
    autoCommitIntervalMs: 1000,
    fetchMaxBytes: 1024 * 512,
    fetchMaxWaitMs: 10,
    fetchMinBytes: 1,
    fromOffset: "earliest",
    heartbeatInterval: 250,
    partitionerType: 3,
    protocol: ["roundrobin"],
    requireAcks: 1,
    retryMinTimeout: 250,
    sessionTimeout: 8000,
    ssl: false,
  },
  produceFlushEveryMs: 1000,
  producerPartitionCount: 1,
  workerPerPartition: 1,
};

export default async (options: ConfigInterface): Promise<WebServer> => {
  const config: ConfigInterface = merge(defaultOptions, options);
  const server = new WebServer(config);
  await server.start();
  return server;
};
