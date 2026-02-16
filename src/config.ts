const utils = require("fi-utils");

utils.logger.set({
  console: {
    active: Boolean(process.env.LOGGING_TRANSPORTS_CONSOLE),
    level: process.env.LOGGING_LEVEL_CONSOLE,
    json: false,
    color: true,
  },
  file: {
    active: process.env.LOGGING_TRANSPORTS_FILE,
    level: process.env.LOGGING_LEVEL_FILE,
    dailyRotate: process.env.LOGGING_TRANSPORTS_DAILY_ROTATE,
    path: process.env.LOGGING_FILE_PATH,
    name: process.env.LOGGING_FILE_NAME,
    maxSize: process.env.LOGGING_FILE_MAXSIZE,
  },
});

// Configuración del servidor de correos
// utils.email.config({
//   options: {
//     host: process.env.EMAIL_HOST,
//     port: process.env.EMAIL_PORT,
//     secure: process.env.EMAIL_SSL,
//     user: process.env.EMAIL_USERNAME,
//     pass: process.env.EMAIL_PASSWORD,
//     name: process.env.EMAIL_HOST_NAME,
//   },
//   defaults: {
//     from: process.env.EMAIL_DEFAULT_FROM,
//   },
//   logger: utils.logger.get(),
// });
