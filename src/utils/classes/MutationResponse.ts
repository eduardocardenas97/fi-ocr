/**
 * @class MutationResponse
 * @description Clase para manejar las respuestas de las mutaciones
 * @param {Number} response.code - Codigo de la respuesta
 * @param {String} response.message - Mensaje de la respuesta
 * @param {Boolean} response.success - Indica si la operacion fue exitosa
 */
export class MutationResponse {
  public code: Number;
  public message: String;
  public success: Boolean;

  constructor(response: {
    code?: Number;
    message?: String;
    success?: Boolean;
  }) {
    // Si no se envia el parametro response, se inicializa con valores por defecto
    this.code = response.code || 200;
    this.message = response.message || "Operacion exitosa";
    // Solo se considera exitosa si el codigo es 200
    this.success = this.code === 200;
  }
}
