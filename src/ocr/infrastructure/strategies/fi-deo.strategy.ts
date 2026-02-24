import { Injectable, Inject } from "@nestjs/common";
import { IExtractionStrategy } from "../../domain/interfaces/extraction-strategy.interface";
import { ExtractionInput } from "../../domain/types/extraction-input.type";
import { ExtractionResult } from "../../domain/types/extraction-result.type";
import { FiDeoConfig } from "./fi-deo/fi-deo.config";
import { CONTEXT } from "@nestjs/graphql";

/**
 * Estrategia de extracción OCR que utiliza el servicio FiDeo.
 * Realiza llamadas HTTP al endpoint de FiDeo con la clave de API
 * proporcionada en la configuración para extraer datos de documentos.
 */
@Injectable()
export class FiDeoStrategy implements IExtractionStrategy<FiDeoConfig> {
  /** Tipo de estrategia — "FI_DEO" */
  readonly strategyType = "FI_DEO";
  private log;
  constructor(@Inject(CONTEXT) private context: any) {
    this.log = this.context.log;
  }

  /**
   * Ejecuta la extracción de datos enviando el archivo al servicio FiDeo.
   * @param input - Datos del archivo a procesar (debe incluir schema en metadata)
   * @param config - Configuración de la estrategia
   * @returns Resultado de la extracción
   */
  async extract(
    input: ExtractionInput,
    config: FiDeoConfig,
  ): Promise<ExtractionResult> {
    // Leer credenciales desde variables de entorno
    const endpoint = process.env.FIDEO_ENDPOINT;
    const apiKey = process.env.FIDEO_API_KEY;

    if (!endpoint || !apiKey) {
      throw new Error(
        "FiDeo no configurado: faltan variables de entorno FIDEO_ENDPOINT o FIDEO_API_KEY",
      );
    }

    this.log.debug(
      `Iniciando extracción para ${input.fileUrl} con config ${JSON.stringify(config)}`,
    );
    // Obtener la imagen en base64
    const imageBase64 = await this.fetchAndConvertToBase64(input.fileUrl);

    this.log.debug(
      `Imagen convertida a base64, longitud ${imageBase64.length} caracteres`,
    );

    // Construir el schema en el formato esperado por FiDeo
    const schema = this.buildFiDeoSchema(input.metadata);

    this.log.debug(`Schema construido para FiDeo: ${JSON.stringify(schema)}`);

    const url = `${endpoint}/api/v1/extract`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": apiKey,
      },
      body: JSON.stringify({
        image_base64: imageBase64,
        schema: schema,
      }),
    });

    this.log.debug(
      `Enviando solicitud a ${url} con schema ${JSON.stringify(schema)}`,
    );

    if (!response.ok) {
      const errorBody = await response.text().catch(() => "Sin detalle");
      throw new Error(
        `Error en la extracción FiDeo: ${response.status} ${response.statusText} - ${errorBody}`,
      );
    }

    const data = await response.json();

    return new ExtractionResult({
      fields: data.data ?? {},
      confidence: 1.0, // FiDeo no retorna confidence, asumimos 100%
      warnings: [],
      metadata: {
        schemaName: data.schema_name,
        processingTimeMs: data.processing_time_ms,
      },
    });
  }

  /**
   * Descarga una imagen desde una URL y la convierte a base64.
   * @param fileUrl - URL de la imagen a descargar
   * @returns String en base64 (con o sin prefijo data:image)
   */
  private async fetchAndConvertToBase64(fileUrl: string): Promise<string> {
    let response;
    this.log.debug(`Descargando imagen desde ${fileUrl}`);
    try {
      response = await fetch(fileUrl);
    } catch (error) {
      this.log.error(
        `Error al descargar la imagen desde ${fileUrl}: ${error.message}`,
      );
      throw new Error(`Error al descargar la imagen: ${error.message}`);
    }
    if (!response.ok) {
      throw new Error(
        `Error al descargar la imagen: ${response.status} ${response.statusText}`,
      );
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    return buffer.toString("base64");
  }

  /**
   * Construye el objeto schema en el formato esperado por FiDeo.
   * @param metadata - Metadatos que contienen extractorName y fieldSchemas
   * @returns Objeto schema para FiDeo
   */
  private buildFiDeoSchema(metadata: Record<string, any>): any {
    const extractorName = metadata.extractorName ?? "Documento";
    const fieldSchemas = metadata.fieldSchemas ?? [];

    const fields: Record<string, any> = {};

    for (const field of fieldSchemas) {
      fields[field.fieldName] = {
        type: this.mapFieldType(field.fieldType),
        required: field.required ?? false,
        description: field.description ?? `Campo ${field.fieldName}`,
      };
    }

    return {
      name: extractorName,
      fields: fields,
    };
  }

  /**
   * Mapea los tipos de campo internos a los tipos esperados por FiDeo.
   * @param fieldType - Tipo de campo interno (string, number, date, etc.)
   * @returns Tipo de campo para FiDeo (str, int, float, date, etc.)
   */
  private mapFieldType(fieldType: string): string {
    const typeMap: Record<string, string> = {
      string: "str",
      number: "int",
      float: "float",
      boolean: "bool",
    };
    return typeMap[fieldType.toLowerCase()] ?? "str";
  }

  /**
   * Valida que la configuración de FiDeo sea correcta.
   * Las credenciales se validan al momento de la extracción.
   * @param config - Configuración a validar
   * @returns true si el tipo de estrategia es correcto
   */
  validateConfig(config: FiDeoConfig): boolean {
    return !!(config && config.strategyType === "FI_DEO");
  }
}
