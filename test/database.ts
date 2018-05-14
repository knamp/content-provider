import localConfig from "./config.local";

module.exports = Object.assign({
  database: "content-provider",
  dialect: "postgres",
  fromMemory: false,
}, localConfig);
