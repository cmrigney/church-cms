import "reflect-metadata";
import { createConnection } from "typeorm";
import { Page } from "./entity/page";
import { createApp } from "./app";
import { User } from "./entity/user";

const PORT = 3000;

createConnection().then(async connection => {

  //Init stuff
  if(!await User.findOne({ where: { username: 'codyrigney92@gmail.com' } })) {
    const user = User.createUser('codyrigney92@gmail.com', 'abc123!', 'Cody', 'Rigney', true);
    await user.save();
  }
  //End init stuff

  const app = createApp();

  app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
}).catch(error => console.log(error));
