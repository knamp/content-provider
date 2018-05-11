import { EventEmitter } from "events";
import { Request, Response } from "express";
import Database from "../database/Database";
import ConfigInterface from "../interfaces/ConfigInterface";

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
    const content = await this.database.get(key);

    if (!content) {
      super.emit("missed", {
        key,
      });

      this.res.status(404).json({
        error: `Content with key ${key} does not exist.`,
      });

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

    return;
  }

}

export default ContentController;
