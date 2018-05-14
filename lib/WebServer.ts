import { EventEmitter } from "events";

import * as cors from "cors";
import * as express from "express";

import ConfigInterface from "./interfaces/ConfigInterface";
import ConsumerPayloadInterface from "./interfaces/ConsumerPayloadInterface";

import ContentController from "./controllers/ContentController";
import Database from "./database/Database";
import Consumer from "./kafka/Consumer";
import healthRoutes from "./routes/health";

export default class WebServer extends EventEmitter {
  private consumer?: Consumer;
  private database: Database;
  private server?: any;

  constructor(private config: ConfigInterface) {
    super();

    this.config = config;

    this.database = this.getDatabase();
    this.server = null;

    if (this.config.kafkaHost) {
      this.consumer = new Consumer(config, this.handleMessage.bind(this));
      this.consumer.on("error", this.handleError.bind(this));
    }

    this.getContent = this.getContent.bind(this);
    this.handleServed = this.handleServed.bind(this);
    this.handleMissed = this.handleMissed.bind(this);
    this.handleError = this.handleError.bind(this);
  }

  public async start(): Promise<void> {

    if (this.database) {
      await this.database.connect();
    }

    if (this.consumer) {
      await this.consumer.connect();
    }

    const app = express();

    app.use(cors());
    app.use(healthRoutes());

    app.get("/content/:key", this.getContent);

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

  private async getContent(req: express.Request, res: express.Response): Promise<void> {
    const content = new ContentController(
      req,
      res,
      this.database,
      this.config,
    );

    content.on("served", this.handleServed);
    content.on("missed", this.handleMissed);
    content.on("error", this.handleError);

    await content.get();
  }

  private getDatabase() {
    const database = new Database(this.config);

    database.on("error", this.handleError);
    database.on("info", (data) => super.emit("info", data));

    return database;
  }

  /**
   * If there is an error, please report it
   */
  private handleError(error: Error): void {
    super.emit("error", error);
  }

  /**
   * If there is no content, please report it
   */
  private handleMissed(data: any): void {
    super.emit("missed", data);
  }

  /**
   * If content is served, please report it
   */
  private handleServed(data: any): void {
    super.emit("served", data);
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
