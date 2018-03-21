import * as EventEmitter from "events";

import * as express from "express";
import * as cors from "cors";

import ConfigInterface from "./interfaces/ConfigInterface";
import Consumer from "./kafka/Consumer";
import ConsumerPayloadInterface from "./interfaces/ConsumerPayloadInterface";

export default class WebServer extends EventEmitter {
    private consumer: Consumer;
    private config: ConfigInterface;
    private server?: any;

    constructor(config: ConfigInterface){
        super();

        this.consumer = new Consumer(config, this.handleMessage.bind(this));
        this.config = config;
        this.server = null;

        this.consumer.on("error", this.handleError.bind(this));
    }

    async start(): Promise<void> {

        await this.consumer.connect();

        const app = express();

        app.use(cors());

        app.get("/admin/health", (req, res) => {
            res.status(200).json({
                status: "UP"
            });
        });

        app.get("/admin/healthcheck", (req, res) => {
            res.status(200).end();
        });

        this.server = await (new Promise((resolve, reject) => {
            let server = undefined;
            server = app.listen(this.config.webserver.port, (error) => {

                if(error){
                    return reject(error);
                }

                resolve(server);
            });
        }));
    }

    public close(): void {

        if(this.consumer){
            this.consumer.close();
        }

        if(this.server){
            this.server.close();
        }
    }

    /**
     * If there is an error, please report it
    */
    private handleError(error: Error): void {
        super.emit("error", error);
    }

    private async handleMessage(message: ConsumerPayloadInterface){
        // empty
    }
}