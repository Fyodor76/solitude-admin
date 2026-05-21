/** Короткий сигнал для нового обращения (Web Audio, без файла). */
export function playSupportAlertSound() {
  if (typeof window === 'undefined') return

  try {
    const ctx = new AudioContext()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.type = 'sine'
    osc.frequency.setValueAtTime(880, ctx.currentTime)
    osc.frequency.setValueAtTime(660, ctx.currentTime + 0.08)

    gain.gain.setValueAtTime(0.0001, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35)

    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.36)

    osc.onended = () => {
      void ctx.close()
    }
  } catch {
    // браузер без AudioContext — тихо пропускаем
  }
}
