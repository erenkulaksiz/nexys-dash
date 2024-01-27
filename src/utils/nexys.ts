import Nexys from "nexys";
import { debugServer } from "nexys/dist/utils";

export const nexys = new Nexys("6d80365a-ef22-47d6-8fbb-265c6ff6bf02", {
  appName: "nexys",
  //server: debugServer,
  allowGeoLocation: false,
  logPoolSize: 40,
  localStorage: {
    cryption: false,
  },
  debug: true,
});
