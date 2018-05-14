import ContentProvider from "../";
import DatabaseConfigInterface from "../lib/interfaces/DatabaseConfigInterface";
import * as database from "./database";

(async () => {

  // tslint:disable-next-line
  console.log("Content-Provider starting..");

  const server = await ContentProvider({
    clientName: "transmitter-client",
    consumeFrom: "produce-topic",
    groupId: "transmitter-group",
    postgres: database as DatabaseConfigInterface,
    webserver: {
      port: 8855,
    },
  });

  server.on("error", (error) => {
    // tslint:disable-next-line
    console.error(error);
  });

  server.on("info", (info) => {
    // tslint:disable-next-line
    console.log("info", info);
  });

  server.on("served", (data) => {
    // tslint:disable-next-line
    console.log("served", data);
  });

  server.on("missed", (data) => {
    // tslint:disable-next-line
    console.log("missed", data);
  });

  server.on("stored", (data) => {
    // tslint:disable-next-line
    console.log("stored", data);
  });

  server.on("deleted", (data) => {
    // tslint:disable-next-line
    console.log("deleted", data);
  });

  // tslint:disable-next-line
  console.log("Content-Provider running.");
})();
