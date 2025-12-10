export abstract class BaseOscillator {
  protected time: number = 0;
  protected isRunning: boolean = false;
  protected slowMotion: boolean = false;
  protected timeStep: number = 0.016; // ~60 FPS

  abstract getPosition(): number;
  abstract getVelocity(): number;
  abstract getAcceleration(): number;
  abstract getAngularFrequency(): number;
  abstract getPeriod(): number;
  abstract getKineticEnergy(): number;
  abstract getPotentialEnergy(): number;
  abstract getTotalEnergy(): number;
  abstract update(deltaTime: number): void;
  abstract reset(): void;
  abstract getParameters(): Record<string, { value: number; unit: string }>;

  getTime(): number {
    return this.time;
  }

  setTimeStep(step: number): void {
    this.timeStep = step;
  }

  setSlowMotion(enabled: boolean): void {
    this.slowMotion = enabled;
  }

  start(): void {
    this.isRunning = true;
  }

  pause(): void {
    this.isRunning = false;
  }

  isPaused(): boolean {
    return !this.isRunning;
  }

  /**
   * Obtiene los datos conocidos del sistema 
   */
  getKnownData(): Record<string, { value: number; unit: string }> {
    return this.getParameters();
  }

  /**
   * Obtiene las incógnitas del sistema 
   */
  getUnknowns(): Record<string, { value: number; unit: string }> {
    return {
      'Posición': { value: 0, unit: 'm' },
      'Velocidad': { value: 0, unit: 'm/s' },
      'Aceleración': { value: 0, unit: 'm/s²' },
      'Energía Cinética': { value: 0, unit: 'J' },
      'Energía Potencial': { value: 0, unit: 'J' },
      'Energía Total': { value: 0, unit: 'J' }
    };
  }

  /**
   * Obtiene las ecuaciones físicas relevantes 
   */
  abstract getEquations(): string[];

  /**
   * Obtiene los cálculos paso a paso 
   */
  getCalculations(): string[] {
    const ω = this.getAngularFrequency();
    const T = this.getPeriod();
    const x = this.getPosition();
    const v = this.getVelocity();
    const a = this.getAcceleration();
    const Ec = this.getKineticEnergy();
    const Ep = this.getPotentialEnergy();
    const Et = this.getTotalEnergy();

    return [
      `ω = ${ω.toFixed(4)} rad/s`,
      `T = 2π/ω = ${T.toFixed(4)} s`,
      `x(t) = ${x.toFixed(4)} m`,
      `v(t) = ${v.toFixed(4)} m/s`,
      `a(t) = ${a.toFixed(4)} m/s²`,
      `Ec = ${Ec.toFixed(4)} J`,
      `Ep = ${Ep.toFixed(4)} J`,
      `Et = Ec + Ep = ${Et.toFixed(4)} J`
    ];
  }
}

