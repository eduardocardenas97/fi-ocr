import { ValidationRule } from '../enums';

/**
 * Representa una validación individual aplicable a un campo extraído.
 * Contiene la regla de validación, sus parámetros y el mensaje de error
 * que se mostrará cuando la validación falle.
 */
export class FieldValidation {
  /** Regla de validación a aplicar (ej: REGEX, MIN_LENGTH) */
  rule: ValidationRule;

  /** Parámetros de la regla (ej: patrón regex, valor mínimo, etc.) */
  params: string | any;

  /** Mensaje de error personalizado cuando la validación falla */
  errorMessage: string;

  constructor(partial?: Partial<FieldValidation>) {
    if (partial) {
      Object.assign(this, partial);
    }
  }
}
