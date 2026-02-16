import { Injectable, Inject } from "@nestjs/common";
import { CONTEXT } from "@nestjs/graphql";

export interface Demo {
  id: string;
  title: string;
  description: string;
  updatedAt: string;
}

@Injectable()
export class ExampleService {
  private log;
  private readonly demos: Demo[] = [
    {
      id: "1",
      title: "Primer demo",
      description: "Recurso de ejemplo para consultas",
      updatedAt: new Date("2024-01-01T10:00:00.000Z").toISOString(),
    },
    {
      id: "2",
      title: "Segundo demo",
      description: "Cómo estructurar un módulo desde cero",
      updatedAt: new Date("2024-01-02T12:30:00.000Z").toISOString(),
    },
  ];

  constructor(@Inject(CONTEXT) private context: any) {
    this.log = this.context.log;
  }

  findAll(): Demo[] {
    try {
      this.log.debug(`Obteniendo todos los datos`);
      const results = this.demos;
      this.log.debug(`Datos obtenidos: ${JSON.stringify(results)}`);
      return results;
    } catch (error) {
      this.log.error(`Error al obtener los datos: ${error.message}`);
      throw error;
    }
  }

  findOne(id: string): Demo | undefined {
    this.log.debug(`Obteniendo dato con id: ${id}`);
    const result = this.demos.find((demo) => demo.id === id);
    this.log.debug(`Resultado encontrado: ${JSON.stringify(result)}`);
    return result;
  }
}
