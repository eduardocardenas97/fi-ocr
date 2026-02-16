import { ApolloDriverConfig } from "@nestjs/apollo";
import { Injectable } from "@nestjs/common";
import { GqlOptionsFactory } from "@nestjs/graphql";
import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";
import Keyv from "keyv";
import KeyvRedis from "@keyv/redis";
import { KeyvAdapter } from "@apollo/utils.keyvadapter";
import responseCachePlugin from "@apollo/server-plugin-response-cache";
import { ApolloServerPluginCacheControl } from "@apollo/server/plugin/cacheControl";
const { logger } = require("fi-utils");

@Injectable()
export class GqlConfigService implements GqlOptionsFactory {
  private cache: Keyv;

  async createGqlOptions(): Promise<ApolloDriverConfig> {
    const cacheTTL = Number(process.env.CACHE_TTL) || 0; // En segundos, por defecto deshabilitado, se debe configurar en .env
    const redisUrl = process.env.REDIS_URL;
    const redisTtlSeconds = Number(process.env.REDIS_TTL) || cacheTTL || 0; // En segundos, por defecto igual a CACHE_TTL, si no está definido entonces deshabilitado
    const projectName =
      process.env.PROJECT_NAME || process.env.LOGGING_FILE_NAME || "app";

    let redis;
    if (cacheTTL !== 0 && redisUrl) {
      redis = new KeyvRedis(redisUrl);
      const ttlMs = redisTtlSeconds > 0 ? redisTtlSeconds * 1000 : undefined;
      this.cache = new Keyv({
        store: redis,
        ttl: ttlMs,
        namespace: projectName,
      });
    }

    return {
      typePaths: ["./**/*.graphql"],
      // Disable subscriptions to avoid pulling in subscriptions-transport-ws
      installSubscriptionHandlers: false,
      playground: false,
      csrfPrevention: true,
      cache: redis ? new KeyvAdapter(this.cache) : undefined,
      plugins: [
        ApolloServerPluginLandingPageLocalDefault(),
        cacheTTL !== 0 &&
          ApolloServerPluginCacheControl({
            defaultMaxAge: Number(process.env.CACHE_TTL) || 60,
          }),
        responseCachePlugin(),
      ].filter(Boolean),
      context: ({ req, res }) => ({
        req,
        log: (() => {
          const log = logger.get();
          res.header("id", log.id.value);
          return log;
        })(),
      }),
    };
  }
}
