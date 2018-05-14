import { EventEmitter } from "events";
import * as Sequelize from "sequelize";

import DatabaseConfigInterface from "../interfaces/DatabaseConfigInterface";
import Models from "../models";

export default class SequelizeDatabase extends EventEmitter {
  private db: Sequelize.Sequelize;

  constructor(private options: DatabaseConfigInterface) {
    super();

    const config = Object.assign({
      database: "",
      password: "",
      username: "",
    }, options);

    this.db = new Sequelize(
      config.database,
      config.username,
      config.password,
      config,
    );
  }

  public async setup(): Promise<void> {
    try {
      await this.testConnection();
      await this.sync();
    } catch (err) {
      super.emit("error", `Unable to set up connection: ${err.message}`);
    }
  }

  public async close(): Promise<void> {
    await this.db.close();
  }

  public getModel(name: string): Sequelize.Model<any, any> {
    return this.db.models[name];
  }

  private async testConnection(): Promise<void> {
    try {
      await this.db.authenticate();
      super.emit("info", "Connection has been established successfully.");
    } catch (err) {
      super.emit("error", `Unable to connect to the database: ${err.message}`);
    }
  }

  private async sync() {
    try {
      this.db = await new Models(this.db).load();
    } catch (err) {
      super.emit("error", `Unable to sync models: ${err.message}`);
    }
  }
}
