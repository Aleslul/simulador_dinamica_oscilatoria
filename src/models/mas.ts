import { BaseOscillator } from '../core/physics.js';

/**
 * Movimiento Armónico Simple (MAS)
 * x(t) = A cos(ωt + φ)
 * ω = √(k/m)
 */
export class MAS extends BaseOscillator {
  private masa: number = 1.0; // kg
  private constanteElastica: number = 10.0; // N/m
  private amplitud: number = 2.0; // m
  private faseInicial: number = 0; // rad
  private posicion: number = 0;
  private velocidad: number = 0;
  private aceleracion: number = 0;

  constructor(masa: number = 1.0, k: number = 10.0, A: number = 2.0, phi: number = 0) {
    super();
    this.masa = masa;
    this.constanteElastica = k;
    this.amplitud = A;
    this.faseInicial = phi;
    this.reset();
  }

  setMasa(m: number): void {
    this.masa = m;
    this.reset();
  }

  setConstanteElastica(k: number): void {
    this.constanteElastica = k;
    this.reset();
  }

  setAmplitud(A: number): void {
    this.amplitud = A;
    this.reset();
  }

  setFaseInicial(phi: number): void {
    this.faseInicial = phi;
    this.reset();
  }

  getAngularFrequency(): number {
    return Math.sqrt(this.constanteElastica / this.masa);
  }

  getPeriod(): number {
    return (2 * Math.PI) / this.getAngularFrequency();
  }

  getPosition(): number {
    return this.posicion;
  }

  getVelocity(): number {
    return this.velocidad;
  }

  getAcceleration(): number {
    return this.aceleracion;
  }

  getKineticEnergy(): number {
    return 0.5 * this.masa * this.velocidad * this.velocidad;
  }

  getPotentialEnergy(): number {
    return 0.5 * this.constanteElastica * this.posicion * this.posicion;
  }

  getTotalEnergy(): number {
    return this.getKineticEnergy() + this.getPotentialEnergy();
  }

  update(deltaTime: number): void {
    if (!this.isRunning) return;

    const dt = this.slowMotion ? deltaTime * 0.1 : deltaTime;
    this.time += dt;

    const ω = this.getAngularFrequency();
    const ωt = ω * this.time + this.faseInicial;

    // x(t) = A cos(ωt + φ)
    this.posicion = this.amplitud * Math.cos(ωt);
    
    // v(t) = -Aω sin(ωt + φ)
    this.velocidad = -this.amplitud * ω * Math.sin(ωt);
    
    // a(t) = -ω²x
    this.aceleracion = -ω * ω * this.posicion;
  }

  reset(): void {
    this.time = 0;
    const ω = this.getAngularFrequency();
    const ωt = ω * this.time + this.faseInicial;
    this.posicion = this.amplitud * Math.cos(ωt);
    this.velocidad = -this.amplitud * ω * Math.sin(ωt);
    this.aceleracion = -ω * ω * this.posicion;
  }

  getParameters(): Record<string, { value: number; unit: string }> {
    return {
      'Masa (m)': { value: this.masa, unit: 'kg' },
      'Constante Elástica (k)': { value: this.constanteElastica, unit: 'N/m' },
      'Amplitud (A)': { value: this.amplitud, unit: 'm' },
      'Fase Inicial (φ)': { value: this.faseInicial, unit: 'rad' }
    };
  }

  getEquations(): string[] {
    return [
      'x(t) = A cos(ωt + φ)',
      'ω = √(k/m)',
      'v(t) = -Aω sin(ωt + φ)',
      'a(t) = -ω²x',
      'T = 2π/ω',
      'Ec = ½mv²',
      'Ep = ½kx²',
      'Et = Ec + Ep'
    ];
  }
}

