import { BaseOscillator } from '../core/physics.js';

/**
 * Panel RA4 - Metodología de Resolución de Problemas
 */
export class RA1Panel {
  private container: HTMLElement;

  constructor(containerId: string) {
    const container = document.getElementById(containerId);
    if (!container) {
      throw new Error(`Contenedor ${containerId} no encontrado`);
    }
    this.container = container;
  }

  update(oscillator: BaseOscillator): void {
    const knownData = oscillator.getKnownData();
    const unknowns = oscillator.getUnknowns();
    const equations = oscillator.getEquations();
    const calculations = oscillator.getCalculations();

    // Cambio: Texto principal a slate-900 (negro suave)
    let html = `
      <div class="space-y-6">
        <h2 class="text-2xl font-bold text-slate-900 mb-4">Metodología RA4 - Resolución de Problemas</h2>
        
        <div class="bg-white border border-gray-200 shadow-sm rounded-lg p-4">
          <h3 class="text-lg font-semibold text-blue-700 mb-3">1. Identificación de Datos Conocidos</h3>
          <div class="space-y-2">
    `;

    for (const [key, value] of Object.entries(knownData)) {
      html += `
        <div class="flex justify-between items-center text-sm">
          <span class="text-gray-600">${key}:</span>
          <span class="text-slate-900 font-bold font-mono">${value.value.toFixed(4)} ${value.unit}</span>
        </div>
      `;
    }

    html += `
          </div>
        </div>

        <div class="bg-white border border-gray-200 shadow-sm rounded-lg p-4">
          <h3 class="text-lg font-semibold text-emerald-700 mb-3">2. Identificación de Incógnitas</h3>
          <div class="space-y-2">
    `;

    for (const [key, value] of Object.entries(unknowns)) {
      html += `
        <div class="flex justify-between items-center text-sm">
          <span class="text-gray-600">${key}:</span>
          <span class="text-amber-600 font-bold font-mono">? ${value.unit}</span>
        </div>
      `;
    }

    html += `
          </div>
        </div>

        <div class="bg-white border border-gray-200 shadow-sm rounded-lg p-4">
          <h3 class="text-lg font-semibold text-purple-700 mb-3">3. Selección de Ecuaciones Físicas</h3>
          <div class="space-y-2">
    `;

    equations.forEach(eq => {
      // Cambio: Fondo de código a gris muy claro (slate-50) y texto oscuro
      html += `
        <div class="text-sm text-slate-800 font-mono bg-slate-50 border border-gray-200 p-2 rounded">
          ${eq}
        </div>
      `;
    });

    html += `
          </div>
        </div>

        <div class="bg-white border border-gray-200 shadow-sm rounded-lg p-4">
          <h3 class="text-lg font-semibold text-orange-700 mb-3">4. Sustitución de Valores y Cálculo</h3>
          <div class="space-y-1 text-sm text-slate-700 font-mono bg-slate-50 border border-gray-200 p-3 rounded max-h-64 overflow-y-auto">
    `;

    calculations.forEach(line => {
      html += `<div class="mb-1 border-b border-gray-100 last:border-0 pb-1">${line}</div>`;
    });

    html += `
          </div>
        </div>

        <div class="bg-white border border-gray-200 shadow-sm rounded-lg p-4">
          <h3 class="text-lg font-semibold text-cyan-700 mb-3">5. Interpretación Física del Resultado</h3>
          <div class="text-sm text-gray-700 space-y-2">
            <p>El sistema oscila con una frecuencia angular de <span class="text-slate-900 font-bold font-mono">${oscillator.getAngularFrequency().toFixed(4)} rad/s</span>.</p>
            <p>El período de oscilación es <span class="text-slate-900 font-bold font-mono">${oscillator.getPeriod().toFixed(4)} s</span>.</p>
            <p>En el instante actual (t = ${oscillator.getTime().toFixed(2)} s):</p>
            <ul class="list-disc list-inside ml-2 space-y-1">
              <li>Posición: <span class="text-slate-900 font-bold font-mono">${oscillator.getPosition().toFixed(4)} m</span></li>
              <li>Velocidad: <span class="text-slate-900 font-bold font-mono">${oscillator.getVelocity().toFixed(4)} m/s</span></li>
              <li>Aceleración: <span class="text-slate-900 font-bold font-mono">${oscillator.getAcceleration().toFixed(4)} m/s²</span></li>
              <li>Energía cinética: <span class="text-slate-900 font-bold font-mono">${oscillator.getKineticEnergy().toFixed(4)} J</span></li>
              <li>Energía potencial: <span class="text-slate-900 font-bold font-mono">${oscillator.getPotentialEnergy().toFixed(4)} J</span></li>
              <li>Energía total: <span class="text-slate-900 font-bold font-mono">${oscillator.getTotalEnergy().toFixed(4)} J</span></li>
            </ul>
          </div>
        </div>
      </div>
    `;

    this.container.innerHTML = html;
  }

  clear(): void {
    // Cambio: Texto gris medio para el estado vacío
    this.container.innerHTML = '<p class="text-gray-500 italic text-center mt-10">Seleccione un sistema para ver la metodología RA1</p>';
  }
}