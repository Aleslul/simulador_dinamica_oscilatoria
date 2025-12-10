import { BaseOscillator } from '../core/physics.js';
import { MAS } from '../models/mas.js';
import { PenduloSimple } from '../models/penduloSimple.js';
import { PenduloCompuesto } from '../models/penduloCompuesto.js';

/**
 * Sistema de controles interactivos para el simulador
 */
export class Controls {
  private container: HTMLElement;
  private oscillator: BaseOscillator | null = null;
  private onParameterChange: (oscillator: BaseOscillator) => void;

  constructor(containerId: string, onParameterChange: (oscillator: BaseOscillator) => void) {
    const container = document.getElementById(containerId);
    if (!container) {
      throw new Error(`Contenedor ${containerId} no encontrado`);
    }
    this.container = container;
    this.onParameterChange = onParameterChange;
  }

  createMASControls(): void {
    const mas = new MAS(1.0, 10.0, 2.0, 0);
    this.oscillator = mas;

    this.container.innerHTML = `
      <h3 class="text-xl font-bold mb-4">Parámetros del MAS</h3>
      <div class="space-y-4">
        <div>
          <label class="block text-sm mb-2">Masa (m): <span id="masaValue" class="text-blue-400">1.0</span> kg</label>
          <input type="range" id="sliderMasa" min="0.1" max="5" step="0.1" value="1.0" 
                 class="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer">
        </div>
        <div>
          <label class="block text-sm mb-2">Constante Elástica (k): <span id="kValue" class="text-blue-400">10.0</span> N/m</label>
          <input type="range" id="sliderK" min="1" max="50" step="1" value="10" 
                 class="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer">
        </div>
        <div>
          <label class="block text-sm mb-2">Amplitud (A): <span id="amplitudValue" class="text-blue-400">2.0</span> m</label>
          <input type="range" id="sliderAmplitud" min="0.5" max="5" step="0.1" value="2.0" 
                 class="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer">
        </div>
        <div>
          <label class="block text-sm mb-2">Fase Inicial (φ): <span id="faseValue" class="text-blue-400">0.0</span> rad</label>
          <input type="range" id="sliderFase" min="0" max="6.28" step="0.1" value="0" 
                 class="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer">
        </div>
      </div>
    `;

    this.setupMASListeners(mas);
  }

  createPenduloSimpleControls(): void {
    const pendulo = new PenduloSimple(1.0, 1.0, 9.81, 0.3);
    this.oscillator = pendulo;

    this.container.innerHTML = `
      <h3 class="text-xl font-bold mb-4">Parámetros del Péndulo Simple</h3>
      <div class="space-y-4">
        <div>
          <label class="block text-sm mb-2">Longitud (L): <span id="longitudValue" class="text-blue-400">1.0</span> m</label>
          <input type="range" id="sliderLongitud" min="0.5" max="2.6" step="0.1" value="1.0" 
                 class="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer">
        </div>
        <div>
          <label class="block text-sm mb-2">Masa (m): <span id="masaValue" class="text-blue-400">1.0</span> kg</label>
          <input type="range" id="sliderMasa" min="0.1" max="5" step="0.1" value="1.0" 
                 class="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer">
        </div>
        <div>
          <label class="block text-sm mb-2">Gravedad (g): <span id="gravedadValue" class="text-blue-400">9.81</span> m/s²</label>
          <input type="range" id="sliderGravedad" min="1" max="20" step="0.1" value="9.81" 
                 class="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer">
        </div>
        <div>
          <label class="block text-sm mb-2">Ángulo Inicial (θ₀): <span id="anguloValue" class="text-blue-400">0.3</span> rad</label>
          <input type="range" id="sliderAngulo" min="0.1" max="0.5" step="0.01" value="0.3" 
                 class="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer">
        </div>
      </div>
    `;

    this.setupPenduloSimpleListeners(pendulo);
  }

  createPenduloCompuestoControls(): void {
    const pendulo = new PenduloCompuesto(0.5, 0.5, 1.0, 9.81, 0.3);
    this.oscillator = pendulo;

    this.container.innerHTML = `
      <h3 class="text-xl font-bold mb-4">Parámetros del Péndulo Compuesto</h3>
      <div class="space-y-4">
        <div>
          <label class="block text-sm mb-2">Momento de Inercia (I): <span id="inerciaValue" class="text-blue-400">0.5</span> kg·m²</label>
          <input type="range" id="sliderInercia" min="0.1" max="2" step="0.1" value="0.5" 
                 class="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer">
        </div>
        <div>
          <label class="block text-sm mb-2">Distancia al Centro de Masa (d): <span id="distanciaValue" class="text-blue-400">0.5</span> m</label>
          <input type="range" id="sliderDistancia" min="0.1" max="1.5" step="0.1" value="0.5" 
                 class="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer">
        </div>
        <div>
          <label class="block text-sm mb-2">Masa (m): <span id="masaValue" class="text-blue-400">1.0</span> kg</label>
          <input type="range" id="sliderMasa" min="0.1" max="5" step="0.1" value="1.0" 
                 class="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer">
        </div>
        <div>
          <label class="block text-sm mb-2">Gravedad (g): <span id="gravedadValue" class="text-blue-400">9.81</span> m/s²</label>
          <input type="range" id="sliderGravedad" min="1" max="20" step="0.1" value="9.81" 
                 class="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer">
        </div>
        <div>
          <label class="block text-sm mb-2">Ángulo Inicial (θ₀): <span id="anguloValue" class="text-blue-400">0.3</span> rad</label>
          <input type="range" id="sliderAngulo" min="0.1" max="0.5" step="0.01" value="0.3" 
                 class="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer">
        </div>
      </div>
    `;

    this.setupPenduloCompuestoListeners(pendulo);
  }

  private setupMASListeners(mas: MAS): void {
    const sliderMasa = document.getElementById('sliderMasa') as HTMLInputElement;
    const sliderK = document.getElementById('sliderK') as HTMLInputElement;
    const sliderAmplitud = document.getElementById('sliderAmplitud') as HTMLInputElement;
    const sliderFase = document.getElementById('sliderFase') as HTMLInputElement;

    sliderMasa?.addEventListener('input', (e) => {
      const value = parseFloat((e.target as HTMLInputElement).value);
      mas.setMasa(value);
      document.getElementById('masaValue')!.textContent = value.toFixed(1);
      this.onParameterChange(mas);
    });

    sliderK?.addEventListener('input', (e) => {
      const value = parseFloat((e.target as HTMLInputElement).value);
      mas.setConstanteElastica(value);
      document.getElementById('kValue')!.textContent = value.toFixed(1);
      this.onParameterChange(mas);
    });

    sliderAmplitud?.addEventListener('input', (e) => {
      const value = parseFloat((e.target as HTMLInputElement).value);
      mas.setAmplitud(value);
      document.getElementById('amplitudValue')!.textContent = value.toFixed(1);
      this.onParameterChange(mas);
    });

    sliderFase?.addEventListener('input', (e) => {
      const value = parseFloat((e.target as HTMLInputElement).value);
      mas.setFaseInicial(value);
      document.getElementById('faseValue')!.textContent = value.toFixed(2);
      this.onParameterChange(mas);
    });
  }

  private setupPenduloSimpleListeners(pendulo: PenduloSimple): void {
    const sliderLongitud = document.getElementById('sliderLongitud') as HTMLInputElement;
    const sliderMasa = document.getElementById('sliderMasa') as HTMLInputElement;
    const sliderGravedad = document.getElementById('sliderGravedad') as HTMLInputElement;
    const sliderAngulo = document.getElementById('sliderAngulo') as HTMLInputElement;

    sliderLongitud?.addEventListener('input', (e) => {
      const value = parseFloat((e.target as HTMLInputElement).value);
      pendulo.setLongitud(value);
      document.getElementById('longitudValue')!.textContent = value.toFixed(1);
      this.onParameterChange(pendulo);
    });

    sliderMasa?.addEventListener('input', (e) => {
      const value = parseFloat((e.target as HTMLInputElement).value);
      pendulo.setMasa(value);
      document.getElementById('masaValue')!.textContent = value.toFixed(1);
      this.onParameterChange(pendulo);
    });

    sliderGravedad?.addEventListener('input', (e) => {
      const value = parseFloat((e.target as HTMLInputElement).value);
      pendulo.setGravedad(value);
      document.getElementById('gravedadValue')!.textContent = value.toFixed(2);
      this.onParameterChange(pendulo);
    });

    sliderAngulo?.addEventListener('input', (e) => {
      const value = parseFloat((e.target as HTMLInputElement).value);
      pendulo.setAnguloInicial(value);
      document.getElementById('anguloValue')!.textContent = value.toFixed(2);
      this.onParameterChange(pendulo);
    });
  }

  private setupPenduloCompuestoListeners(pendulo: PenduloCompuesto): void {
    const sliderInercia = document.getElementById('sliderInercia') as HTMLInputElement;
    const sliderDistancia = document.getElementById('sliderDistancia') as HTMLInputElement;
    const sliderMasa = document.getElementById('sliderMasa') as HTMLInputElement;
    const sliderGravedad = document.getElementById('sliderGravedad') as HTMLInputElement;
    const sliderAngulo = document.getElementById('sliderAngulo') as HTMLInputElement;

    sliderInercia?.addEventListener('input', (e) => {
      const value = parseFloat((e.target as HTMLInputElement).value);
      pendulo.setMomentoInercia(value);
      document.getElementById('inerciaValue')!.textContent = value.toFixed(1);
      this.onParameterChange(pendulo);
    });

    sliderDistancia?.addEventListener('input', (e) => {
      const value = parseFloat((e.target as HTMLInputElement).value);
      pendulo.setDistanciaCentroMasa(value);
      document.getElementById('distanciaValue')!.textContent = value.toFixed(1);
      this.onParameterChange(pendulo);
    });

    sliderMasa?.addEventListener('input', (e) => {
      const value = parseFloat((e.target as HTMLInputElement).value);
      pendulo.setMasa(value);
      document.getElementById('masaValue')!.textContent = value.toFixed(1);
      this.onParameterChange(pendulo);
    });

    sliderGravedad?.addEventListener('input', (e) => {
      const value = parseFloat((e.target as HTMLInputElement).value);
      pendulo.setGravedad(value);
      document.getElementById('gravedadValue')!.textContent = value.toFixed(2);
      this.onParameterChange(pendulo);
    });

    sliderAngulo?.addEventListener('input', (e) => {
      const value = parseFloat((e.target as HTMLInputElement).value);
      pendulo.setAnguloInicial(value);
      document.getElementById('anguloValue')!.textContent = value.toFixed(2);
      this.onParameterChange(pendulo);
    });
  }

  getOscillator(): BaseOscillator | null {
    return this.oscillator;
  }
}

