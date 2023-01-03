export interface Usuario {
  idUsuario: number;
  nombreApellidos: string;
  correo: string;
  idRol: number;
  rolDescripcion: string;
  idLocal: number;
  LocalDescripcion: string;
  clave: string;
  esActivo: boolean;
}
