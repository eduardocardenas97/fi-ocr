import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import "./config";
import * as bodyParser from "body-parser";
import { graphqlUploadExpress } from "graphql-upload-ts";

const { logger } = require("fi-utils");
const { email } = require("fi-utils");

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const whitelistValue = process.env.CORS_WHITELIST;
  const whitelist = whitelistValue ? JSON.parse(whitelistValue) : ["*"];
  app.enableCors({
    origin: whitelist,
  });
  app.use(bodyParser.json({ limit: "50mb" }));
  app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
  app.use("/graphql", graphqlUploadExpress({ maxFiles: 1 }));

  const log = logger.get();
  log.info("CORS enabled");
  const port = process.env.PORT || 4000;

  // Configuracion global del pipe utilizado para validar los DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      //Remueve todo lo que no está incluído en los DTOs
      whitelist: true,
      //Retorna bad request si hay propiedades en el objeto no requeridas
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(port);
  log.info(`🚀 Application is running on: ${await app.getUrl()}`);
}
bootstrap();
