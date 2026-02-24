import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExtractorDocument, ExtractorSchema } from './infrastructure/persistence/schemas/extractor.schema';
import { MongoExtractorRepository } from './infrastructure/persistence/repositories/mongo-extractor.repository';
import { EXTRACTOR_REPOSITORY } from './domain/interfaces/extractor-repository.interface';
import { FiDeoStrategy } from './infrastructure/strategies/fi-deo.strategy';
import { StrategyRegistry } from './application/registry/strategy.registry';
import { ExtractorService } from './application/services/extractor.service';
import { ExtractorResolver } from './presentation/extractor.resolver';
import { FieldValidatorService } from './application/services/field-validator.service';

/**
 * Módulo principal de OCR.
 * Registra todos los componentes necesarios para la gestión
 * de extractores y la ejecución de extracciones OCR.
 */
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ExtractorDocument.name, schema: ExtractorSchema },
    ]),
  ],
  providers: [
    // Resolver GraphQL
    ExtractorResolver,

    // Servicio de aplicación
    ExtractorService,

    // Motor de validaciones post-extracción
    FieldValidatorService,

    // Registry de estrategias — se inicializa con FiDeoStrategy
    {
      provide: StrategyRegistry,
      useFactory: (fiDeoStrategy: FiDeoStrategy) => {
        const registry = new StrategyRegistry();
        registry.register(fiDeoStrategy);
        return registry;
      },
      inject: [FiDeoStrategy],
    },

    // Estrategia FiDeo
    FiDeoStrategy,

    // Repositorio de extractores (desacoplado via token)
    {
      provide: EXTRACTOR_REPOSITORY,
      useClass: MongoExtractorRepository,
    },
  ],
})
export class OcrModule {}
