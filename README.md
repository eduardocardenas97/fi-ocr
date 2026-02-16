# NestJS GraphQL Microservice Template

Template base para construir microservicios con NestJS y GraphQL. Está pensado para clonarse y extenderse cuando se requiera un nuevo microservicio, manteniendo una estructura y convenciones comunes.

## 📌 Objetivo del template

- Servir como punto de partida para nuevos microservicios.
- Estandarizar configuración, estructura y utilidades compartidas.
- Facilitar el desarrollo de GraphQL con tipados automáticos.
- Centralizar scripts útiles (build, lint, schema check, etc.).

## 🧰 Stack principal

- **NestJS 11**
- **Apollo Server 5**
- **GraphQL** con archivos `.graphql` como fuente de esquema
- **TypeScript**
- **fi-utils** para logging y utilidades comunes
- **Keyv / Redis** (opcional) para caching de respuestas

## 🚀 Inicio rápido

### 1) Instalar dependencias

```bash
yarn install
```

> El Dockerfile utiliza `yarn.lock`. Se recomienda usar Yarn para consistencia.

### 2) Configurar variables de entorno

Crea un archivo `.env` tomando como base [example.env](example.env):

```bash
cp example.env .env
```

Configura al menos:

- `PORT`
- `NODE_ENV`
- `CORS_WHITELIST`
- Variables JWT
- Configuración de base de datos

### 3) Ejecutar en desarrollo

```bash
yarn start:dev
```

La API estará disponible en:

- `http://localhost:4000/graphql`

## 📦 Scripts disponibles

- `yarn start` — inicia la app
- `yarn start:dev` — modo desarrollo con watch
- `yarn build` — compila a `dist/`
- `yarn lint` — lint + fix
- `yarn test` — pruebas unitarias
- `yarn schema:check` — valida esquema contra Apollo Studio

## 🧬 Arquitectura de GraphQL

El esquema se define en archivos `.graphql` dentro de `src/`. Los tipados TypeScript se generan automáticamente en:

- `src/graphql.schema.ts`

Generación de typings:

- Se ejecuta automáticamente en `yarn start:dev`
- También se ejecuta antes de `yarn build`

Validación de esquema (Apollo Studio):

```bash
APOLLO_GRAPH_REF=<org>@<graph> yarn schema:check
```

## 🧱 Estructura del proyecto

```
src/
  app.module.ts              # Módulo raíz
  main.ts                    # Bootstrap del servidor
  config.ts                  # Configuración de logging (fi-utils)
  gqlconfig.service.ts       # Configuración GraphQL/Apollo
  graphql.schema.ts          # Tipados generados

  example/                   # Módulo de ejemplo
    example.graphql
    example.module.ts
    example.resolver.ts
    example.service.ts

  common/
    decorators/              # Decoradores reutilizables

  interfaces/                # Tipados de contexto y JWT

  utils/
    cache/graphql/           # Directivas de cache
    classes/                 # Utilidades (MutationResponse, GeneralError, MailSender)
```

## ✅ Convenciones recomendadas

- Todo módulo debe tener su carpeta con:
  - `*.module.ts`
  - `*.resolver.ts`
  - `*.service.ts`
  - `*.graphql`
- Separar interfaces y clases utilitarias en `src/interfaces` y `src/utils`.
- Evitar lógica en resolvers; delegar en services.

## ➕ Cómo agregar un nuevo módulo

1. Crear carpeta `src/<modulo>/`.
2. Definir el schema en `src/<modulo>/<modulo>.graphql`.
3. Crear `resolver` y `service`.
4. Registrar el módulo en `AppModule`.

> Al iniciar en modo dev, los tipos se regeneran automáticamente.

## 🧰 Logging y utilidades

El template usa `fi-utils` para logging. Configuración central en:

- [src/config.ts](src/config.ts)

Utilidades incluidas:

- `GeneralError` para errores GraphQL enriquecidos
- `MutationResponse` para respuestas uniformes
- `MailSender` para envío de correos

## 🐳 Docker

El Dockerfile construye la app y genera una imagen ligera (`distroless`).

Variables importantes en build:

- `NPM_TOKEN` (para instalar paquetes privados)

Ejemplo de build:

```bash
docker build --build-arg NPM_TOKEN=xxxxx -t my-service .
```

Ejemplo de ejecución:

```bash
docker run -p 4000:4000 --env-file .env my-service
```

## 🧪 Testing

```bash
yarn test
```

## 📎 Notas importantes

- Este repositorio es un **template**, no un microservicio funcional final.
- Antes de iniciar un nuevo microservicio, clona este repositorio y ajusta:
  - nombre del proyecto
  - variables de entorno
  - módulos de negocio

---

### ✅ Checklist al crear un nuevo microservicio

- [ ] Actualizar `package.json` (nombre, descripción)
- [ ] Configurar `.env`
- [ ] Renombrar módulos si aplica
- [ ] Validar esquema GraphQL
- [ ] Confirmar logging y JWT
