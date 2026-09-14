export const logClientAction = (accion: string, pagina: string, detalles?: string) => {
  try {
    fetch('/api/logs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ accion, pagina, detalles }),
    }).catch(err => console.error("Silenced log error:", err));
  } catch (e) {
    // Ignore log errors so it doesn't break the UI
  }
};
