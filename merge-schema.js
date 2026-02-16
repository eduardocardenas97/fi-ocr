const fs = require('fs');
const path = require('path');
const glob = require('glob');
const { mergeTypeDefs } = require('@graphql-tools/merge');
const { print } = require('graphql');

// Mensajes
const messages = {
  outputFile: (fileName) => `📦 Fichero de salida: ${fileName}`,
  noFilesFound:
    '🚫 No se encontraron ficheros .graphql en el directorio especificado.',
  schemaUnchanged: '✨ El schema no ha cambiado, no es necesario actualizar.',
  schemaChanged: '🔄 El schema ha cambiado, actualizando el archivo...',
  creatingNewFile:
    '📄 El archivo graphql.schema.graphql no existe, creando uno nuevo...',
  schemaSaved: (filePath) => `✅ Schema guardado en ${filePath}`,
  errorCombiningSchemas: (error) =>
    `❌ Error al combinar los esquemas GraphQL: ${error}`,
};
// Directorio donde están los ficheros .graphql
const graphqlDirName = process.argv[3] || 'src';
const graphqlDir = path.join(__dirname, graphqlDirName);
// El fichero de salida se recibe como argumento
const outputFileName = process.argv[2] || 'graphql.schema.graphql';
console.log(messages.outputFile(outputFileName));
const outputFilePath = path.join(__dirname, outputFileName);
// Funciones puras
const getGraphqlFiles = (directory) => glob.sync(`${directory}/**/*.graphql`);
const readFileContent = (filePath) => fs.readFileSync(filePath, 'utf-8');
const fileExists = (filePath) => fs.existsSync(filePath);
const writeFileContent = (filePath, content) =>
  fs.writeFileSync(filePath, content, 'utf-8');

// Función principal
const combineGraphqlSchemas = (inputDirectory, outputFile) => {
  const files = getGraphqlFiles(inputDirectory);

  if (files.length === 0) {
    console.error(messages.noFilesFound);
    process.exit(1);
  }

  const typeDefs = files.map((file) => readFileContent(file));
  const mergedTypeDefs = mergeTypeDefs(typeDefs);
  const mergedSchema = print(mergedTypeDefs);

  if (fileExists(outputFile)) {
    const existingSchema = readFileContent(outputFile);

    if (existingSchema === mergedSchema) {
      console.log(messages.schemaUnchanged);
      process.exit(0); // Salir sin hacer cambios
    } else {
      console.log(messages.schemaChanged);
    }
  } else {
    console.log(messages.creatingNewFile);
  }

  writeFileContent(outputFile, mergedSchema);
  console.log(messages.schemaSaved(outputFile));
};

// Ejecutar la función principal
try {
  combineGraphqlSchemas(graphqlDir, outputFilePath);
} catch (error) {
  console.error(messages.errorCombiningSchemas(error));
  process.exit(1);
}
