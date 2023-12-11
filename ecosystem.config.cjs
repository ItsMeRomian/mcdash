module.exports = {
  apps: [
    {
      name: "NuxtAppName",
      port: "8081",
      exec_mode: "cluster",
      instances: "max",
      script: "PORT=8081 ./.output/server/index.mjs",
    },
  ],
};
