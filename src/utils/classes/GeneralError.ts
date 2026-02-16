import { GraphQLError } from "graphql";

/**
 * @class GeneralError
 * @description Clase que extiende de GraphQLError para manejar errores de forma personalizada
 */
export class GeneralError extends GraphQLError {
  private cause: any;
  private context: any;
  constructor(
    message: string,
    { code = "INTERNAL_SERVER_ERROR", idReq, cause = null, args = null },
  ) {
    super(message, {
      extensions: {
        code,
        idReq,
        cause: GeneralError.retornarData(cause),
        args: GeneralError.retornarData(args),
      },
    });
    this.cause = cause;
    this.context = args;
  }

  /**
   * @method retornarData
   * @description Metodo para retornar la excepcion completa en el ambiente de desarrollo
   * @param {any} data - Data del error
   */
  static retornarData(data: any) {
    return process.env.NODE_ENV === "development" && data ? data : null;
  }
}
