# Crear un archivo temporal para combinar todos los .graphql mediante 
# un script .js y luego ejecutar el check de schema utilizando rover
COMBINED_SCHEMA="graphql.schema.graphql"
# Realizar la llamada al script de node para combinar los .graphql
node ./merge-schema.js $COMBINED_SCHEMA

# Verificar que la variable de entorno APOLLO_GRAPH_REF esté definida
if [ -z "$APOLLO_GRAPH_REF" ]; then
  echo "Error: La variable de entorno APOLLO_GRAPH_REF no está definida."
  exit 1
fi

# Ejecutar el check de schema utilizando npx y rover
npx rover graph check $APOLLO_GRAPH_REF --schema $COMBINED_SCHEMA

# Limpiar el archivo temporal si la variable NODE_ENV es production
if [ "$NODE_ENV" = "production" ]; then
  rm $COMBINED_SCHEMA
else
  echo "🚧 Advertencia: El fichero $COMBINED_SCHEMA no se ha eliminado. Este fichero es exclusivo para desarrollo 🛠️"
fi