import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

/**
 * Subdocumento para validaciones de campos.
 * Persiste las reglas de validación aplicables a cada campo del extractor.
 */
@Schema({ _id: false })
export class FieldValidationSchema {
  /** Regla de validación (REGEX, MIN_LENGTH, MAX_LENGTH, DATE_FORMAT, NUMERIC_RANGE, CUSTOM) */
  @Prop({ required: true })
  rule: string;

  /** Parámetros de la regla de validación */
  @Prop({ type: String })
  params: string;

  /** Mensaje de error personalizado */
  @Prop()
  errorMessage: string;
}

export const FieldValidationMongoSchema = SchemaFactory.createForClass(FieldValidationSchema);

/**
 * Subdocumento para el esquema de un campo del extractor.
 * Define la estructura esperada de cada campo a extraer.
 */
@Schema({ _id: false })
export class FieldSchemaDoc {
  /** Nombre identificador del campo */
  @Prop({ required: true })
  fieldName: string;

  /** Tipo de dato esperado (string, number, date, etc.) */
  @Prop({ required: true })
  fieldType: string;

  /** Indica si el campo es obligatorio */
  @Prop({ required: true, default: false })
  required: boolean;

  /** Descripción del campo (útil para LLMs y documentación) */
  @Prop()
  description: string;

  /** Validaciones aplicables al campo */
  @Prop({ type: [FieldValidationMongoSchema], default: [] })
  validations: FieldValidationSchema[];
}

export const FieldSchemaMongoSchema = SchemaFactory.createForClass(FieldSchemaDoc);

/**
 * Documento principal de Mongoose para el Extractor (Aggregate Root).
 * Representa la colección 'extractors' en MongoDB.
 */
@Schema({
  collection: 'extractors',
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (_doc: any, ret: any) => {
      ret.id = ret._id?.toString();
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  },
})
export class ExtractorDocument {
  /** Nombre descriptivo del extractor */
  @Prop({ required: true })
  name: string;

  /** Descripción del propósito del extractor */
  @Prop()
  description: string;

  /** Esquema de campos a extraer */
  @Prop({ type: [FieldSchemaMongoSchema], default: [] })
  schema: FieldSchemaDoc[];

  /**
   * Configuración de la estrategia de extracción.
   * Se almacena como un objeto flexible con `strategyType` como discriminador.
   * Las credenciales sensibles (endpoint, apiKey) se leen desde variables de entorno.
   */
  @Prop(
    raw({
      strategyType: { type: String, required: true },
    }),
  )
  strategyConfig: Record<string, any>;
}

export type ExtractorDoc = HydratedDocument<ExtractorDocument>;
export const ExtractorSchema = SchemaFactory.createForClass(ExtractorDocument);
