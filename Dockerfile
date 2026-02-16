# Etapa 1: Dependencias de producción
FROM node:24-alpine AS deps
WORKDIR /app
ARG NPM_TOKEN
ENV NPM_TOKEN=$NPM_TOKEN
COPY package.json yarn.lock ./
RUN echo "//npm.pkg.github.com/:_authToken=${NPM_TOKEN}" > .npmrc \
	&& yarn config set registry https://npm.pkg.github.com/ --scope=@fintechinnovaciondev \
	&& yarn install --frozen-lockfile --production=true \
	&& rm -f .npmrc

# Etapa 2: Construir la aplicación
FROM node:24-alpine AS builder
WORKDIR /app
ARG NPM_TOKEN
ENV NPM_TOKEN=$NPM_TOKEN
COPY package.json yarn.lock ./
RUN echo "//npm.pkg.github.com/:_authToken=${NPM_TOKEN}" > .npmrc \
	&& yarn config set registry https://npm.pkg.github.com/ --scope=@fintechinnovaciondev \
	&& yarn install --frozen-lockfile \
	&& rm -f .npmrc
COPY . .
RUN yarn run build


# Etapa 3: Crear la imagen de producción
FROM gcr.io/distroless/nodejs24-debian12 AS production
WORKDIR /app

# Copiar la aplicación construida de la etapa anterior
COPY --from=builder /app/dist ./dist
COPY --from=deps /app/node_modules ./node_modules

# Exponer el puerto
EXPOSE 4000

# Comando para iniciar el proyecto.
# Se utiliza el flag --env-file de Node.js (v20.6+) para cargar variables de entorno desde el archivo de secretos,
# ya que las imágenes distroless no incluyen un shell para ejecutar scripts .sh.
CMD ["dist/src/main.js"]