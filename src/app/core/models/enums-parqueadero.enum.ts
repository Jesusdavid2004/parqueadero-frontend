export enum EstadoEspacio {
  DISPONIBLE = 'DISPONIBLE',
  OCUPADO = 'OCUPADO',
  RESERVADO = 'RESERVADO',
  INACTIVO = 'INACTIVO'
}

export enum EstadoPago {
  PENDIENTE = 'PENDIENTE',
  APROBADO = 'APROBADO',
  RECHAZADO = 'RECHAZADO',
  REEMBOLSADO = 'REEMBOLSADO'
}

export enum EstadoReserva {
  PENDIENTE = 'PENDIENTE',
  CONFIRMADA = 'CONFIRMADA',
  CANCELADA = 'CANCELADA',
  VENCIDA = 'VENCIDA'
}

export enum EstadoTicket {
  ABIERTO = 'ABIERTO',
  CERRADO = 'CERRADO',
  FACTURADO = 'FACTURADO'
}

export enum MetodoPago {
  EFECTIVO = 'EFECTIVO',
  TARJETA = 'TARJETA',
  TRANSFERENCIA = 'TRANSFERENCIA',
  QR = 'QR'
}

export enum RolUsuario {
  ADMIN = 'ADMIN',
  CLIENTE = 'CLIENTE'
}

export enum TipoVehiculo {
  CARRO = 'CARRO',
  MOTO = 'MOTO',
  CAMION = 'CAMION'
}

export enum TipoZona {
  CARROS = 'CARROS',
  MOTOS = 'MOTOS',
  CAMIONES = 'CAMIONES',
  MIXTA = 'MIXTA'
}