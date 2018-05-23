import { EventEmitter } from "events";
import { Request, Response } from "express";
import Database from "../database/Database";
import ConfigInterface from "../interfaces/ConfigInterface";
import ContentInterface from "../interfaces/ContentInterface";

class ContentController extends EventEmitter {
  constructor(
    private req: Request,
    private res: Response,
    private database: Database,
    private config: ConfigInterface,
  ) {
    super();
  }

  public async get(): Promise<void> {
    const { key } = this.req.params;
    try {
      const content: string = await this.database.get(key);

      await this.render(key, content);
    } catch (error) {
      throw new Error(error);
    }

    return;
  }

  public async getByPath(): Promise<void> {
    const path = this.req.params[0];

    try {
      const entry: ContentInterface | null = await this.database.getByPath(path);

      if (entry) {
        await this.render(path, entry.content);
      }
    } catch (error) {
      super.emit("missed", {
        key: path,
      });
    }

    this.sendError(`Content with path ${path} not found`);

    return;
  }

  private async render(key: string, content: string): Promise<void> {
    if (!content) {
      super.emit("missed", {
        key,
      });

      this.sendError(`Content with key or path "${key}" does not exist.`);

      return;
    }

    super.emit("served", {
      key,
    });

    this.res.status(200);
    this.res.set("content-type", "text/html");
    this.res.set("cache-control", `max-age=${this.config.webserver.contentMaxAgeSec || 300}`);
    this.res.write(content);
    this.res.end();
  }

  private sendError(errorMessage: string): void {
    this.res.status(404).json({
      error: errorMessage,
    });
  }
}

export default ContentController;
