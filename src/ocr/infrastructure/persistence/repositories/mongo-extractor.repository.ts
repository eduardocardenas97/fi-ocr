import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Extractor } from '../../../domain/entities/extractor.entity';
import { FieldSchema } from '../../../domain/value-objects/field-schema.vo';
import { FieldValidation } from '../../../domain/value-objects/field-validation.vo';
import { IExtractorRepository } from '../../../domain/interfaces/extractor-repository.interface';
import { IStrategyConfig } from '../../../domain/interfaces/strategy-config.interface';
import { ValidationRule } from '../../../domain/enums/validation-rule.enum';
import { ExtractorDocument, ExtractorDoc } from '../schemas/extractor.schema';

/**
 * Implementación del repositorio de extractores usando MongoDB/Mongoose.
 * Se encarga de mapear entre los documentos de MongoDB y las entidades
 * de dominio del extractor.
 */
@Injectable()
export class MongoExtractorRepository implements IExtractorRepository {
  constructor(
    @InjectModel(ExtractorDocument.name)
    private readonly model: Model<ExtractorDoc>,
  ) {}

  /**
   * Guarda un nuevo extractor en MongoDB.
   */
  async save(extractor: Partial<Extractor>): Promise<Extractor> {
    const doc = await this.model.create({
      name: extractor.name,
      description: extractor.description,
      schema: extractor.schema,
      strategyConfig: extractor.strategyConfig,
    });
    return this.toDomain(doc);
  }

  /**
   * Busca un extractor por su ID en MongoDB.
   */
  async findById(id: string): Promise<Extractor | null> {
    const doc = await this.model.findById(id).exec();
    return doc ? this.toDomain(doc) : null;
  }

  /**
   * Obtiene una lista de extractores filtrada.
   */
  async findAll(filter?: Record<string, any>): Promise<Extractor[]> {
    const query: Record<string, any> = {};

    if (filter?.name) {
      query.name = { $regex: filter.name, $options: 'i' };
    }
    if (filter?.strategyType) {
      query['strategyConfig.strategyType'] = filter.strategyType;
    }

    const docs = await this.model.find(query).sort({ createdAt: -1 }).exec();
    return docs.map((doc) => this.toDomain(doc));
  }

  /**
   * Actualiza parcialmente un extractor existente.
   */
  async update(id: string, data: Partial<Extractor>): Promise<Extractor | null> {
    const doc = await this.model
      .findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true })
      .exec();
    return doc ? this.toDomain(doc) : null;
  }

  /**
   * Elimina un extractor de MongoDB.
   */
  async delete(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id).exec();
    return !!result;
  }

  /**
   * Mapea un documento de Mongoose a una entidad de dominio Extractor.
   */
  private toDomain(doc: ExtractorDoc): Extractor {
    const plain = doc.toJSON() as any;
    return new Extractor({
      id: plain.id ?? doc._id?.toString(),
      name: plain.name,
      description: plain.description,
      schema: (plain.schema ?? []).map(
        (s: any) =>
          new FieldSchema({
            fieldName: s.fieldName,
            fieldType: s.fieldType,
            required: s.required,
            validations: (s.validations ?? []).map(
              (v: any) =>
                new FieldValidation({
                  rule: v.rule as ValidationRule,
                  params: v.params,
                  errorMessage: v.errorMessage,
                }),
            ),
          }),
      ),
      strategyConfig: plain.strategyConfig as IStrategyConfig,
      createdAt: plain.createdAt,
      updatedAt: plain.updatedAt,
    });
  }
}
