export interface Suministro {
  id: string;
  nombre: string;
  categoria: 'Armamento' | 'Médico' | 'Sigilo' | 'Herramientas';
  stock: number;
  precioUnitario: number;
  rangoRequerido: 'Genin' | 'Chunin' | 'Jonin' | 'Anbu';
  ultimaActualizacion: string;
}

export type Categoria = Suministro['categoria'];
export type Rango = Suministro['rangoRequerido'];
export type OrdenCampo = keyof Suministro;
export type OrdenDir = 'asc' | 'desc';

// Datos de ejemplo base
export const SUMINISTROS_MOCK: Suministro[] = [
  { id: 'S001', nombre: 'Kunai de Acero',          categoria: 'Armamento',    stock: 150, precioUnitario:  15, rangoRequerido: 'Genin',  ultimaActualizacion: '2024-03-01' },
  { id: 'S002', nombre: 'Shuriken Gigante',         categoria: 'Armamento',    stock:  65, precioUnitario:  80, rangoRequerido: 'Chunin', ultimaActualizacion: '2024-03-04' },
  { id: 'S003', nombre: 'Explosivo de Arcilla',     categoria: 'Armamento',    stock:   5, precioUnitario: 400, rangoRequerido: 'Anbu',   ultimaActualizacion: '2024-03-10' },
  { id: 'S004', nombre: 'Píldoras de Soldado',      categoria: 'Médico',       stock:  80, precioUnitario:  50, rangoRequerido: 'Chunin', ultimaActualizacion: '2024-03-05' },
  { id: 'S005', nombre: 'Ungüento Curativo',         categoria: 'Médico',       stock:  70, precioUnitario: 120, rangoRequerido: 'Genin',  ultimaActualizacion: '2024-03-07' },
  { id: 'S006', nombre: 'Kit de Medicina de Campo', categoria: 'Médico',       stock:  18, precioUnitario: 300, rangoRequerido: 'Jonin',  ultimaActualizacion: '2024-03-09' },
  { id: 'S007', nombre: 'Bomba de Humo',            categoria: 'Sigilo',       stock: 120, precioUnitario:  25, rangoRequerido: 'Anbu',   ultimaActualizacion: '2024-03-02' },
  { id: 'S008', nombre: 'Capa de Invisibilidad',    categoria: 'Sigilo',       stock:  65, precioUnitario: 500, rangoRequerido: 'Jonin',  ultimaActualizacion: '2024-03-01' },
  { id: 'S009', nombre: 'Señuelo de Chakra',        categoria: 'Sigilo',       stock:   7, precioUnitario: 250, rangoRequerido: 'Anbu',   ultimaActualizacion: '2024-03-11' },
  { id: 'S010', nombre: 'Pergamino de Sellado',     categoria: 'Herramientas', stock:  65, precioUnitario: 200, rangoRequerido: 'Jonin',  ultimaActualizacion: '2024-03-08' },
  { id: 'S011', nombre: 'Hilo de Alambre Ninja',    categoria: 'Herramientas', stock:  60, precioUnitario:  35, rangoRequerido: 'Genin',  ultimaActualizacion: '2024-03-06' },
  { id: 'S012', nombre: 'Kit de Infiltración',      categoria: 'Herramientas', stock:   5, precioUnitario: 600, rangoRequerido: 'Anbu',   ultimaActualizacion: '2024-03-12' },
];
