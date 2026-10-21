// Mod demonstrativ: dacă DEMO_NOINDEX=1 e setat pe server, site-ul nu e indexat de Google.
// Se citește doar la rulare (process.env), ca schimbarea variabilei să nu ceară un build nou.
export function demoMode() {
  return process.env.DEMO_NOINDEX === '1';
}
