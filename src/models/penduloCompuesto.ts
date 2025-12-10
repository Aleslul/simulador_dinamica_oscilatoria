import { BaseOscillator } from '../core/physics.js';

/**
 * Péndulo Compuesto
 * ω = √(mgd / I)
 * T = 2π √(I / mgd)
 */
export class PenduloCompuesto extends BaseOscillator {
  private momentoInercia: number = 0.5; // kg·m²
  private distanciaCentroMasa: number = 0.5; // m
  private masa: number = 1.0; // kg
  private gravedad: number = 9.81; // m/s²
  private anguloInicial: number = 0.3; // rad
  private angulo: number = 0;
  private velocidadAngular: number = 0;
  private aceleracionAngular: number = 0;

  constructor(I: number = 0.5, d: number = 0.5, m: number = 1.0, g: number = 9.81, theta0: number = 0.3) {
    super();
    this.momentoInercia = I;
    this.distanciaCentroMasa = d;
    this.masa = m;
    this.gravedad = g;
    this.anguloInicial = theta0;
    this.reset();
  }

  setMomentoInercia(I: number): void {
    this.momentoInercia = I;
    this.reset();
  }

  setDistanciaCentroMasa(d: number): void {
    this.distanciaCentroMasa = d;
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
    return Math.sqrt((this.masa * this.gravedad * this.distanciaCentroMasa) / this.momentoInercia);
  }

  getPeriod(): number {
    return (2 * Math.PI) / this.getAngularFrequency();
  }

  getPosition(): number {
    // Posición del centro de masa
    return this.distanciaCentroMasa * Math.sin(this.angulo);
  }

  getVelocity(): number {
    return this.distanciaCentroMasa * this.velocidadAngular * Math.cos(this.angulo);
  }

  getAcceleration(): number {
    const term1 = this.distanciaCentroMasa * this.aceleracionAngular * Math.cos(this.angulo);
    const term2 = -this.distanciaCentroMasa * this.velocidadAngular * this.velocidadAngular * Math.sin(this.angulo);
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
    return 0.5 * this.momentoInercia * this.velocidadAngular * this.velocidadAngular;
  }

  getPotentialEnergy(): number {
    const h = this.distanciaCentroMasa * (1 - Math.cos(this.angulo));
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
    
    // Para pequeñas oscilaciones: θ(t) ≈ θ₀ cos(ωt)
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
      'Momento de Inercia (I)': { value: this.momentoInercia, unit: 'kg·m²' },
      'Distancia al Centro de Masa (d)': { value: this.distanciaCentroMasa, unit: 'm' },
      'Masa (m)': { value: this.masa, unit: 'kg' },
      'Gravedad (g)': { value: this.gravedad, unit: 'm/s²' },
      'Ángulo Inicial (θ₀)': { value: this.anguloInicial, unit: 'rad' }
    };
  }

  getEquations(): string[] {
    return [
      'θ(t) ≈ θ₀ cos(ωt)',
      'ω = √(mgd / I)',
      'T = 2π√(I / mgd)',
      'Ec = ½Iω²',
      'Ep = mgd(1-cos(θ))',
      'Et = Ec + Ep'
    ];
  }
}

