import "reflect-metadata";
import { createConnection } from "typeorm";
import { Page } from "./entity/page";
import { createApp } from "./app";

const PORT = 3000;

createConnection().then(async connection => {

  const app = createApp();

  app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
}).catch(error => console.log(error));
