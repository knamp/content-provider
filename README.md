# Content Provider

[![Greenkeeper badge](https://badges.greenkeeper.io/knamp/content-provider.svg)](https://greenkeeper.io/)

Process and store HTML content from Apache Kafka and provide via API.

## Usage

Install via yarn

    yarn install @knamp/content-provider

Then configure it and use it

```javascript
import ContentProvider from "@knamp/content-provider";

(async () => {

  const server = ContentProvider({
    clientName: "transmitter-client",
    consumeFrom: "produce-topic",
    database: {
      fromMemory: true,
    },
    groupId: "transmitter-group",
    webserver: {
      port: 8855,
    },
  });

  server.on("served", (data) => {
    console.log("served", data);
  });

  server.on("missed", (data) => {
    console.log("missed", data);
  });

  server.on("stored", (data) => {
    console.log("stored", data);
  });

  server.on("deleted", (data) => {
    console.log("deleted", data);
  });

  server.on("error", (error) => {
    console.error(error);
  });

  await server.start()
})();
```

You can now also get entries from the database by running

```typescript
import { getByPath } from "@knamp/content-provider";

(async () => {
  const path: string = ``;

  const entry = await getByPath(path);

  console.log(entry);
})();
```

## Development

For development you need to create a local config file for the database
`config.local.ts` in `test`.

It could looke like this

```typescript
  export default {
    active: true,
    database: "contentprovider",
    logging: (...params) => {
      // tslint:disable-next-line
      return console.info(...params);
    },
    password: "contentprovider",
    pool: {
      idle: 10000,
      max: 5,
      min: 1,
    },
    port: 5432,
    seederStorage: "sequelize",
    username: "contentprovider",
  };
```

## Uses

* [Sinek](https://github.com/nodefluent/node-sinek), consuming and producing
  messages to and from Apache Kafka

## License

This project is under [MIT](./LICENSE).
