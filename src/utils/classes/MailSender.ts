const utils = require("fi-utils");

export interface IEnvioCorreo {
  correoElectronico: string;
  nroDocumento: string;
  htmlCorreoElectronico?: string;
  asuntoCorreoElectronico?: string;
  textoCorreoElectronico?: string;
}

export interface IDataEnvioCorreo {
  remitentes: Object;
  emisor: string;
  asunto: string;
  cuerpo: Object;
  adjunto: [];
}

export default class MailSender {
  async enviarCorreoElectronico(data: IEnvioCorreo, log: any): Promise<string> {
    try {
      log.debug(`NotificacionDataSource.enviarCorreoElectronico()`);
      const datos: IDataEnvioCorreo = {
        remitentes: {
          directo: data.correoElectronico,
          copia: "",
        },
        emisor: "",
        asunto: data.asuntoCorreoElectronico ?? "",
        cuerpo: {
          texto: data.textoCorreoElectronico ?? "",
          html: data.htmlCorreoElectronico ?? "",
        },
        adjunto: [],
      };
      const emailEnviado = await utils.email.send(datos, log);
      return emailEnviado;
    } catch (error) {
      log.error(error);
      throw new Error("EnviarCorreoElectronicoError " + error);
    }
  }
}
