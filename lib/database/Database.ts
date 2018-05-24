import { EventEmitter } from "events";
import * as Sequelize from "sequelize";

import ConfigInterface from "../interfaces/ConfigInterface";
import ContentInterface from "../interfaces/ContentInterface";
import SequelizeDatabase from "./SequelizeDatabase";

export default class Database extends EventEmitter {
  private config: ConfigInterface;
  private fromMemory: boolean;
  private memStorage: object;
  private database?: SequelizeDatabase;
  private model?: Sequelize.Model<any, any>;

  constructor(config: ConfigInterface) {
    super();

    this.config = config;
    this.memStorage = {};

    this.fromMemory = this.config.postgres.fromMemory || !this.config.postgres.username;

    if (!this.fromMemory) {
      this.setupDatabase();
    }
  }

  public async connect(): Promise<void> {
    if (this.database) {
      try {
        await this.database.setup();

        this.model = await this.database.getModel("Content");
      } catch (err) {
        super.emit("error", `Error getting models: ${err.message}`);
      }
    }
  }

  public async set(key: string, content: string, path: string): Promise<void> {
    if (this.fromMemory) {
      this.memStorage[key] = content;
      return;
    }

    if (this.model) {
      this.model.upsert({
        content,
        id: key,
        path: this.getPathForQuery(path),
      });
    } else {
      super.emit("error", `No model available, cannot store ${key}`);
    }

    return;
  }

  public async get(key: string): Promise<any> {
    if (this.fromMemory) {
      return this.memStorage[key];
    }

    if (this.model) {
      const content = await this.model.findOne({
        where: {
          id: key,
        },
      });

      if (content) {
        return content.dataValues.content;
      }
    } else {
      super.emit("error", `No model available, cannot get ${key}`);
    }

    return "";
  }

  public async getByPath(path: string): Promise<ContentInterface | null> {

    if (this.model) {
      const content = await this.model.findOne({
        order: [["createdAt", "DESC"]],
        where: {
          path: `/${this.getPathForQuery(path)}`,
        },
      });

      if (content) {
        return content.dataValues;
      }
    } else {
      super.emit("error", `No model available, cannot getByPath ${path}`);
    }

    return null;
  }

  public async del(key: string): Promise<void> {
    if (this.fromMemory) {
      delete this.memStorage[key];
    }

    if (this.model) {
      await this.model.destroy({
        where: {
          id: key,
        },
      });
    }
  }

  public async close(): Promise<void> {
    if (this.database) {
      await this.database.close();
    }
  }

  private setupDatabase(): void {
    this.database = new SequelizeDatabase(this.config.postgres);

    this.database.on("info", (...params) => super.emit("info", ...params));
    this.database.on("error", (...params) => super.emit("error", ...params));
  }

  private getPathForQuery(path: string): string {
    let queryPath = path.startsWith("/") ? path.substr(1) : path;
    queryPath = queryPath.endsWith("/") ? path.substring(0, path.length - 1) : path;

    return queryPath;
  }
}
