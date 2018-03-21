import * as EventEmitter from "events";

import { NConsumer as SinekConsumer } from "sinek";

import ConfigInterface from "./../interfaces/ConfigInterface";
import ConsumerPayloadInterface from "./../interfaces/ConsumerPayloadInterface";

export default class Consumer extends EventEmitter {
  private consumer: SinekConsumer;

  constructor(
    private config: ConfigInterface,
    private process: (message: ConsumerPayloadInterface) => Promise<void>,
  ) {
    super();

    const { consumeFrom } = config;
    this.consumer = new SinekConsumer(consumeFrom, config);
    this.consume = this.consume.bind(this);
    this.handleError = this.handleError.bind(this);
  }

  /**
   * Initially connect to Consumer
   */
  public async connect(): Promise<void> {
    try {
      await this.consumer.connect();
    } catch (error) {
      this.handleError(error);
    }

    // Consume as JSON with callback
    try {
      // Do not await this (it only fires after first message)
      this.consumer.consume(
        this.consume.bind(this),
        true,
        true,
        this.config.consumerOptions,
      ).catch((error) => this.handleError(error));
    } catch (error) {
      this.handleError(error);
    }

    this.consumer.on("error", this.handleError.bind(this));
  }

  /**
   * Closes the consumer
   */
  public close(): void {

    if (this.consumer) {
        this.consumer.close();
    }
  }

  /**
   * Handle consuming messages
   */
  private async consume(
    message: object,
    callback: (error: Error | null) => void,
  ): Promise<void> {
    let error: Error | null;

    try {
      await this.handleMessage(message);
      error = null;
    } catch (producedError) {
      this.handleError(producedError);
      error = producedError;
    }

    // Return this callback to receive further messages
    callback(error);
  }

  /**
   * Handle newly created messages
   */
  private async handleMessage(message: any) {

    const messageContent: ConsumerPayloadInterface = {
        content: message.value.content,
        key: message.key.toString("utf8"),
        path: message.value.path,
    };

    await this.process(messageContent);
  }

  /**
   * If there is an error, please report it
   */
  private handleError(error: Error) {
    super.emit("error", error);
  }
}