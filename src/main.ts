import { BaseOscillator } from './core/physics.js';
import { Controls } from './ui/controls.js';
import { Charts } from './ui/charts.js';
import { Renderer } from './ui/renderer.js';
import { RA1Panel } from './ui/RA1Panel.js';

/**
 * Aplicación principal del simulador de dinámica oscilatoria
 */
class SimulatorApp {
  private controls: Controls;
  private charts: Charts;
  private renderer: Renderer;
  private ra1Panel: RA1Panel;
  private animationId: number | null = null;
  private lastTime: number = 0;
  private isSlowMotion: boolean = false;

  constructor() {
    // Inicializar componentes
    this.controls = new Controls('controlsContainer', (oscillator) => {
      this.onParameterChange(oscillator);
    });
    this.charts = new Charts();
    this.renderer = new Renderer('animationCanvas');
    this.ra1Panel = new RA1Panel('ra1Panel');

    // Configurar eventos
    this.setupEventListeners();

    // Inicializar con MAS
<<<<<<< HEAD
=======
    

>>>>>>> 85fdda8500df533dff6f570ba1e9d29129ddedd8
    this.controls.createMASControls();
    const oscillator = this.controls.getOscillator();
    if (oscillator) {
      this.renderer.setOscillator(oscillator);
      this.ra1Panel.update(oscillator);
    } 
  }

  private setupEventListeners(): void {
    // Selector de sistema
    const systemSelector = document.getElementById('systemSelector') as HTMLSelectElement;
    systemSelector?.addEventListener('change', (e) => {
      const systemType = (e.target as HTMLSelectElement).value;
      this.switchSystem(systemType);
    });

    // Botones de control
    const btnStart = document.getElementById('btnStart');
    const btnPause = document.getElementById('btnPause');
    const btnReset = document.getElementById('btnReset');
    const btnSlowMotion = document.getElementById('btnSlowMotion');

    btnStart?.addEventListener('click', () => this.start());
    btnPause?.addEventListener('click', () => this.pause());
    btnReset?.addEventListener('click', () => this.reset());
    btnSlowMotion?.addEventListener('click', () => this.toggleSlowMotion());
  }

  private switchSystem(systemType: string): void {
    this.pause();
    this.charts.clear();

    switch (systemType) {
      case 'mas':
        this.controls.createMASControls();
        break;
      case 'penduloSimple':
        this.controls.createPenduloSimpleControls();
        break;
      case 'penduloCompuesto':
        this.controls.createPenduloCompuestoControls();
        break;
    }

    const oscillator = this.controls.getOscillator();
    if (oscillator) {
      this.renderer.setOscillator(oscillator);
      this.ra1Panel.update(oscillator);
    }
  }

  private onParameterChange(oscillator: BaseOscillator): void {
    this.renderer.setOscillator(oscillator);
    this.ra1Panel.update(oscillator);
    this.charts.clear();
  }

  private start(): void {
    const oscillator = this.controls.getOscillator();
    if (!oscillator) return;

<<<<<<< HEAD
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }

=======
>>>>>>> 85fdda8500df533dff6f570ba1e9d29129ddedd8
    oscillator.start();
    this.lastTime = performance.now() / 1000;
    this.animate();
  }

  private pause(): void {
    const oscillator = this.controls.getOscillator();
    if (oscillator) {
      oscillator.pause();
    }
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  private reset(): void {
    this.pause();
    const oscillator = this.controls.getOscillator();
    if (oscillator) {
      oscillator.reset();
      this.renderer.setOscillator(oscillator);
      this.ra1Panel.update(oscillator);
      this.charts.clear();
    }
  }

  private toggleSlowMotion(): void {
    this.isSlowMotion = !this.isSlowMotion;
    const oscillator = this.controls.getOscillator();
    if (oscillator) {
      oscillator.setSlowMotion(this.isSlowMotion);
    }
    const btn = document.getElementById('btnSlowMotion');
    if (btn) {
      btn.textContent = this.isSlowMotion ? 'Cámara Normal' : 'Cámara Lenta';
      btn.className = this.isSlowMotion 
        ? 'bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded flex-1 font-bold'
        : 'bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded flex-1 font-bold';
    }
  }

  private animate = (): void => {
    const oscillator = this.controls.getOscillator();
    if (!oscillator || oscillator.isPaused()) {
      return;
    }

    const currentTime = performance.now() / 1000;
    const deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;

    // Actualizar física
    oscillator.update(deltaTime);

    // Renderizar
    this.renderer.render();
    this.charts.update(oscillator);
    this.ra1Panel.update(oscillator);

    // Continuar animación
    this.animationId = requestAnimationFrame(this.animate);
  };
}

// Inicializar aplicación cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new SimulatorApp();
  });
} else {
  new SimulatorApp();
}

