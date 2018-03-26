import * as EventEmitter from "events";

import * as cors from "cors";
import * as express from "express";

import ConfigInterface from "./interfaces/ConfigInterface";
import ConsumerPayloadInterface from "./interfaces/ConsumerPayloadInterface";

import Database from "./database/Database";
import Consumer from "./kafka/Consumer";

export default class WebServer extends EventEmitter {
  private consumer: Consumer | null = null;
  private database: Database;
  private config: ConfigInterface;
  private server?: any;

  constructor(config: ConfigInterface) {
    super();

    this.config = config;

    this.database = new Database(config);
    this.server = null;

    if (this.config.kafkaHost) {
      this.consumer = new Consumer(config, this.handleMessage.bind(this));
      this.consumer.on("error", this.handleError.bind(this));
    }
  }

  public async start(): Promise<void> {

    await this.database.connect();

    if (this.consumer) {
      await this.consumer.connect();
    }

    const app = express();

    app.use(cors());

    app.get("/admin/health", (req, res) => {
      res.status(200).json({
        status: "UP",
      });
    });

    app.get("/admin/healthcheck", (req, res) => {
      res.status(200).end();
    });

    app.get("/content/:key", async (req, res) => {

      const content = await this.database.get(req.params.key);
      if (!content) {

        super.emit("missed", {
          key: req.params.key,
        });

        return res.status(404).json({
          error: `Content with key ${req.params.key} does not exist.`,
        });
      }

      super.emit("served", {
        key: req.params.key,
      });

      res.status(200);
      res.set("content-type", "text/html");
      res.set("cache-control", `max-age=${this.config.webserver.contentMaxAgeSec || 300}`);
      res.write(content);
      res.end();
    });

    this.server = await (new Promise((resolve, reject) => {
      let server;
      server = app.listen(this.config.webserver.port, (error) => {

        if (error) {
          return reject(error);
        }

        resolve(server);
      });
    }));
  }

  public close(): void {

    if (this.consumer) {
      this.consumer.close();
    }

    if (this.server) {
      this.server.close();
    }

    if (this.database) {
      this.database.close();
    }
  }

  /**
   * If there is an error, please report it
   */
  private handleError(error: Error): void {
    super.emit("error", error);
  }

  /**
   * Handles an incoming Kafka message from the consumer
   * by applying a delete or set on the database (table)
   * @param message
   */
  private async handleMessage(message: ConsumerPayloadInterface) {

    if (!message.content) {
      super.emit("deleted", message);
      return await this.database.del(message.key);
    }

    await this.database.set(message.key, message.content);
    super.emit("stored", message);
  }
}
