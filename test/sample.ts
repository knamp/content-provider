import ContentProvider from "../";

(async () => {

  // tslint:disable-next-line
  console.log("Content-Provider starting..");

  const processor = await ContentProvider({
    clientName: "transmitter-client",
    consumeFrom: "produce-topic",
    groupId: "transmitter-group",
    webserver: {
      port: 8855,
    },
  });

  processor.on("error", (error) => {
    // tslint:disable-next-line
    console.error(error);
  });

  // tslint:disable-next-line
  console.log("Content-Provider running.");
})();
