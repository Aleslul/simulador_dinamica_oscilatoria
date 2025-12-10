import { BaseOscillator } from '../core/physics.js';

/**
 * Péndulo Simple
 * Aproximación para ángulos pequeños: θ(t) ≈ θ₀ cos(ωt)
 * ω = √(g/L)
 */
export class PenduloSimple extends BaseOscillator {
  private longitud: number = 1.0; // m
  private masa: number = 1.0; // kg
  private gravedad: number = 9.81; // m/s²
  private anguloInicial: number = 0.3; // rad (~17°)
  private angulo: number = 0;
  private velocidadAngular: number = 0;
  private aceleracionAngular: number = 0;

  constructor(L: number = 1.0, m: number = 1.0, g: number = 9.81, theta0: number = 0.3) {
    super();
    this.longitud = L;
    this.masa = m;
    this.gravedad = g;
    this.anguloInicial = theta0;
    this.reset();
  }

  setLongitud(L: number): void {
    this.longitud = L;
    this.reset();
  }

  setMasa(m: number): void {
    this.masa = m;
    this.reset();
  }

  setGravedad(g: number): void {
    this.gravedad = g;
    this.reset();
  }

  setAnguloInicial(theta0: number): void {
    this.anguloInicial = theta0;
    this.reset();
  }

  getAngularFrequency(): number {
    return Math.sqrt(this.gravedad / this.longitud);
  }

  getPeriod(): number {
    return (2 * Math.PI) / this.getAngularFrequency();
  }

  getPosition(): number {
    // Posición horizontal (x = L sin(θ))
    return this.longitud * Math.sin(this.angulo);
  }

  getVelocity(): number {
    // Velocidad horizontal
    return this.longitud * this.velocidadAngular * Math.cos(this.angulo);
  }

  getAcceleration(): number {
    // Aceleración horizontal
    const term1 = this.longitud * this.aceleracionAngular * Math.cos(this.angulo);
    const term2 = -this.longitud * this.velocidadAngular * this.velocidadAngular * Math.sin(this.angulo);
    return term1 + term2;
  }

  getAngulo(): number {
    return this.angulo;
  }

  getVelocidadAngular(): number {
    return this.velocidadAngular;
  }

  getAceleracionAngular(): number {
    return this.aceleracionAngular;
  }

  getKineticEnergy(): number {
    const v = this.longitud * this.velocidadAngular;
    return 0.5 * this.masa * v * v;
  }

  getPotentialEnergy(): number {
    const h = this.longitud * (1 - Math.cos(this.angulo));
    return this.masa * this.gravedad * h;
  }

  getTotalEnergy(): number {
    return this.getKineticEnergy() + this.getPotentialEnergy();
  }

  update(deltaTime: number): void {
    if (!this.isRunning) return;

    const dt = this.slowMotion ? deltaTime * 0.1 : deltaTime;
    this.time += dt;

    const ω = this.getAngularFrequency();
    
    // Para ángulos pequeños: θ(t) ≈ θ₀ cos(ωt)
    this.angulo = this.anguloInicial * Math.cos(ω * this.time);
    this.velocidadAngular = -this.anguloInicial * ω * Math.sin(ω * this.time);
    this.aceleracionAngular = -this.anguloInicial * ω * ω * Math.cos(ω * this.time);
  }

  reset(): void {
    this.time = 0;
    const ω = this.getAngularFrequency();
    this.angulo = this.anguloInicial * Math.cos(ω * this.time);
    this.velocidadAngular = -this.anguloInicial * ω * Math.sin(ω * this.time);
    this.aceleracionAngular = -this.anguloInicial * ω * ω * Math.cos(ω * this.time);
  }

  getParameters(): Record<string, { value: number; unit: string }> {
    return {
      'Longitud (L)': { value: this.longitud, unit: 'm' },
      'Masa (m)': { value: this.masa, unit: 'kg' },
      'Gravedad (g)': { value: this.gravedad, unit: 'm/s²' },
      'Ángulo Inicial (θ₀)': { value: this.anguloInicial, unit: 'rad' }
    };
  }

  getEquations(): string[] {
    return [
      'θ(t) ≈ θ₀ cos(ωt)',
      'ω = √(g/L)',
      'T = 2π√(L/g)',
      'x = L sin(θ)',
      'v = Lω cos(θ)',
      'Ec = ½mv²',
      'Ep = mgh = mgL(1-cos(θ))',
      'Et = Ec + Ep'
    ];
  }
}

