import * as fs from "fs";
import * as path from "path";
import * as Sequelize from "sequelize";

class Models {
  constructor(private db: Sequelize.Sequelize) {}

  public load(): Sequelize.Sequelize {
    const basename: string = path.basename(__filename);

    fs.readdirSync(__dirname)
      .filter((file: string) => {
        return (file.indexOf(".") !== 0) && (file !== basename) &&
          (file.slice(-3) === ".js");
      })
      .forEach((file: string) => {
        const model = this.db.import(path.join(__dirname, file));

        this.db[model.name] = model;
      });

    Object.keys(this.db).forEach((modelName) => {
      if (this.db[modelName].associate) {
        this.db[modelName].associate(this.db);
      }
    });

    return this.db;
  }
}

export default Models;
