import * as Sequelize from "sequelize";

import ConfigInterface from "./../interfaces/ConfigInterface";

export default class Database {
  private config: ConfigInterface;
  private fromMemory: boolean;
  private memStorage: object;

  constructor(config: ConfigInterface) {
    this.config = config;
    this.memStorage = {};

    if (this.config.database.fromMemory) {
      this.fromMemory = true;
    } else {
      this.fromMemory = false;
      // TODO: create sequelize
    }
  }

  public async connect(): Promise<void> {
    // TODO: connect to sequelize and sync models
  }

  public async set(key: string, content: string): Promise<void> {

    if (this.fromMemory) {
      this.memStorage[key] = content;
      return;
    }

    // TODO: store with sequelize model
    return;
  }

  public async get(key: string): Promise<string> {

    if (this.fromMemory) {
      return this.memStorage[key];
    }

    // TODO: retrieve with sequelize model
    return "";
  }

  public async del(key: string): Promise<void> {

    if (this.fromMemory) {
      delete this.memStorage[key];
    }

    // TODO: delete with sequelize model
  }

  public close(): void {
    // TODO: close sequelize
  }
}
