# Content Provider

Process and store HTML content from Apache Kafka and provide via API.

## Usage

Install via yarn

    yarn install knamp-content-provider

Then configure it and use it

```javascript
import ContentProvider from "knamp-content-provider";

(async () => {

  const server = await ContentProvider({
    clientName: "transmitter-client",
    consumeFrom: "produce-topic",
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
})();
```

## Uses

* [Sinek](https://github.com/nodefluent/node-sinek), consuming and producing messages to and from Apache Kafka

## License

This project is under [MIT](./LICENSE).