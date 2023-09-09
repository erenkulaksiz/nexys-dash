import Nexys from "nexys";

export const nexys = new Nexys("6d80365a-ef22-47d6-8fbb-265c6ff6bf02", {
  appName: "nexys",
  debug: true,
  allowGeoLocation: false,
  logPoolSize: 20,
  localStorage: {
    cryption: false,
  },
  /*errors: {
    allowAutomaticHandling: false,
  },*/
});
