/* Puente para avisar por socket desde los servicios.

   Los controladores alcanzan Socket.IO con `req.app.get('io')`, pero los
   servicios no tienen `req`. Pasarles la instancia por parámetro habría
   obligado a tocar la firma de media aplicación para una función accesoria, así
   que se guarda aquí y se expone una sola operación.

   Todo lo de este módulo es "mejor si llega": si el socket no está disponible,
   o la persona no tiene ninguna pestaña abierta, no pasa nada. La notificación
   ya está guardada en la base y aparecerá igualmente al cargar cualquier
   página. Por eso nada de aquí lanza. */

let io = null;

export function setIo(instance) {
  io = instance;
}

/* Sala personal de cada usuario. Todas sus pestañas y dispositivos se unen a
   la misma, de modo que el aviso llega a todos a la vez. */
export const userRoom = (userId) => `user:${userId}`;

export function emitToUser(userId, event, payload) {
  if (!io || !userId) return false;
  try {
    io.to(userRoom(userId)).emit(event, payload);
    return true;
  } catch (error) {
    console.error('[socket] no se pudo emitir', event, error.message);
    return false;
  }
}
