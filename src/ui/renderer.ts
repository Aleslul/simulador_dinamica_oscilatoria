import { BaseOscillator } from '../core/physics.js';
import { MAS } from '../models/mas.js';
import { PenduloSimple } from '../models/penduloSimple.js';
import { PenduloCompuesto } from '../models/penduloCompuesto.js';
import { start } from 'repl';

/**
 * Renderizador de animaciones físicas usando HTML5 Canvas
 */
export class Renderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private oscillator: BaseOscillator | null = null;

  constructor(canvasId: string) {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!canvas) {
      throw new Error(`Canvas ${canvasId} no encontrado`);
    }
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('No se pudo obtener el contexto 2D del canvas');
    }
    this.ctx = ctx;
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
  }

  private resizeCanvas(): void {
    const container = this.canvas.parentElement;
    if (container) {
      this.canvas.width = container.clientWidth - 32; // Padding
      this.canvas.height = 400;
    }
  }

  setOscillator(oscillator: BaseOscillator): void {
    this.oscillator = oscillator;
  }

  render(): void {
    if (!this.oscillator) return;

    const width = this.canvas.width;
    const height = this.canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    // Limpiar canvas
    this.ctx.fillStyle = '#0f172a';
    this.ctx.fillRect(0, 0, width, height);

    // Dibujar según el tipo de oscilador
    if (this.oscillator instanceof MAS) {
      this.renderMAS(centerX, centerY, width, height);
    } else if (this.oscillator instanceof PenduloSimple) {
      this.renderPenduloSimple(centerX, centerY, width, height);
    } else if (this.oscillator instanceof PenduloCompuesto) {
      this.renderPenduloCompuesto(centerX, centerY, width, height);
    }

    // Dibujar información
    this.drawInfo();

    // Dibujar la informacion de los elementos de cada simulacion
    this.drawElementsInfo(this.oscillator);
  }

  // FUNCION PARA RENDERIZAR LA SIMULACION DE MAS
  private renderMAS(centerX: number, centerY: number, width: number, height: number): void {
    const mas = this.oscillator as MAS;
    const x = mas.getPosition();
    const A = mas.getParameters()['Amplitud (A)'].value;
    const scale = Math.min(width, height) / (A * 2 + 2);

    // Dibujar resorte
    this.ctx.strokeStyle = '#475569';
    this.ctx.lineWidth = 3;
    const springX = centerX - A * scale;
    const springLength = A * 2 * scale;
    this.drawSpring(springX, centerY, springLength, 20);

    // Dibujar pared
    this.ctx.fillStyle = '#64748b';
    this.ctx.fillRect(springX - 20, centerY - 50, 20, 100);

    // Dibujar masa
    const massX = centerX + x * scale;
    const massSize = this.getMassRadius(mas);     //TODO: Cambiando massSize estatico por uno variable segun masa con la funcion getMassRadius() (Valor original: 20)
    this.ctx.fillStyle = '#3b82f6';
    this.ctx.beginPath();
    this.ctx.rect(massX - massSize / 2, centerY - massSize / 2, massSize, massSize);
    this.ctx.fill();
    this.ctx.strokeStyle = '#1e40af';
    this.ctx.lineWidth = 2;
    this.ctx.stroke();

    // Dibujar línea de referencia
    this.ctx.strokeStyle = '#334155';
    this.ctx.setLineDash([5, 5]);
    this.ctx.beginPath();
    this.ctx.moveTo(centerX, centerY - 100);
    this.ctx.lineTo(centerX, centerY + 100);
    this.ctx.stroke();
    this.ctx.setLineDash([]);

    // Dibujar trayectoria
    this.drawTrajectory(centerX, centerY, scale, A);
  }

  // FUNCION PARA RENDERIZAR LA SIMULACION DE PENDULO SIMPLE
  private renderPenduloSimple(centerX: number, centerY: number, width: number, height: number): void {
    const pendulo = this.oscillator as PenduloSimple;
    const L = pendulo.getParameters()['Longitud (L)'].value;
    const θ = pendulo.getAngulo();
    const scale = Math.min(width, height) * 0.3;

    // Punto de suspensión
    const pivotX = centerX;
    const pivotY = centerY - height / 3;

    // Calcular posición de la masa
    const massX = pivotX + L * scale * Math.sin(θ);
    const massY = pivotY + L * scale * Math.cos(θ);

    // Dibujar hilo
    this.ctx.strokeStyle = '#64748b';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(pivotX, pivotY);
    this.ctx.lineTo(massX, massY);
    this.ctx.stroke();

    // Dibujar punto de suspensión
    this.ctx.fillStyle = '#94a3b8';
    this.ctx.beginPath();
    this.ctx.arc(pivotX, pivotY, 5, 0, 2 * Math.PI);
    this.ctx.fill();

    // Dibujar masa
    const massSize = this.getMassRadius(pendulo);    //TODO: Cambiando massSize estatico por uno variable segun masa con la funcion getMassRadius() (Valor original: 20)
    this.ctx.fillStyle = '#41f63bff';
    this.ctx.beginPath();
    this.ctx.arc(massX, massY, massSize, 0, 2 * Math.PI);
    this.ctx.fill();
    this.ctx.strokeStyle = '#259021';
    this.ctx.lineWidth = 2;
    this.ctx.stroke();

    // Dibujar trayectoria (NO SIRVE)
    // this.drawPendulumTrajectory(pivotX, pivotY, L * scale);
  }

  // FUNCION PARA RENDERIZAR LA SIMULACION DE PENDULO COMPUESTO
  private renderPenduloCompuesto(centerX: number, centerY: number, width: number, height: number): void {
    const pendulo = this.oscillator as PenduloCompuesto;
    const d = pendulo.getParameters()['Distancia al Centro de Masa (d)'].value;
    const θ = pendulo.getAngulo();
    const scale = Math.min(width, height) * 0.3;

    // Punto de suspensión
    const pivotX = centerX;
    const pivotY = centerY - height / 3;

    // Calcular posición del centro de masa
    const cmX = pivotX + d * scale * Math.sin(θ);
    const cmY = pivotY + d * scale * Math.cos(θ);

    // Dibujar barra
    this.ctx.strokeStyle = '#64748b';
    this.ctx.lineWidth = 4;
    this.ctx.beginPath();
    this.ctx.moveTo(pivotX, pivotY);
    this.ctx.lineTo(cmX, cmY);
    this.ctx.stroke();

    // Dibujar punto de suspensión
    this.ctx.fillStyle = '#94a3b8';
    this.ctx.beginPath();
    this.ctx.arc(pivotX, pivotY, 6, 0, 2 * Math.PI);
    this.ctx.fill();

    // Dibujar cuerpo rígido (barra extendida)
    const barLength = d * scale * 1.5;
    const barEndX = pivotX + barLength * Math.sin(θ);
    const barEndY = pivotY + barLength * Math.cos(θ);

    //TODO: CAMBIANDO ESTILO (ESTILO ORIGINAL: #475569)
    this.ctx.strokeStyle = '#ea00ffff';
    this.ctx.lineWidth = 6;
    this.ctx.beginPath();
    this.ctx.moveTo(pivotX, pivotY);
    this.ctx.lineTo(barEndX, barEndY);
    this.ctx.stroke();

    // Dibujar centro de masa
    this.ctx.fillStyle = '#ef4444';
    this.ctx.beginPath();
    this.ctx.arc(cmX, cmY, this.getMassRadius(pendulo), 0, 2 * Math.PI);
    this.ctx.fill();
    this.ctx.strokeStyle = '#dc2626';
    this.ctx.lineWidth = 2;
    this.ctx.stroke();
  }

  private drawSpring(x: number, y: number, length: number, coils: number): void {
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
    const coilWidth = length / coils;
    for (let i = 0; i < coils; i++) {
      const coilX = x + i * coilWidth;
      const amplitude = 10;
      this.ctx.quadraticCurveTo(
        coilX + coilWidth / 4, y - amplitude,
        coilX + coilWidth / 2, y
      );
      this.ctx.quadraticCurveTo(
        coilX + (3 * coilWidth) / 4, y + amplitude,
        coilX + coilWidth, y
      );
    }
    this.ctx.stroke();
  }

  private drawTrajectory(centerX: number, centerY: number, scale: number, A: number): void {
    this.ctx.strokeStyle = 'rgba(59, 130, 246, 0.3)';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    for (let i = 0; i < 100; i++) {
      const t = (i / 100) * 2 * Math.PI;
      const x = centerX + A * scale * Math.cos(t);
      const y = centerY + 20 * Math.sin(t * 2);
      if (i === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }
    }
    this.ctx.stroke();
  }
  
  // FUNCION PARA GRAFICAR LA TRAYECTORIA DEL PENDULO (NO SIRVE)
  private drawPendulumTrajectory(pivotX: number, pivotY: number, radius: number): void {
    this.ctx.strokeStyle = 'rgba(59, 130, 246, 0.2)';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();

    //TODO: cambiando los valores en radianes (Valores originales: -0.5, 0.5)
    this.ctx.arc(pivotX, pivotY, radius, -0.5, 0.5);
    this.ctx.stroke();
  }

  // Dibuja la informacion de cada simulacion en tiempo real
  private drawInfo(): void {
    const borderRadius = 5;

    if (!this.oscillator) return;

    this.ctx.fillStyle = '#334155';
    this.roundRect(10, 10, 250, 120, borderRadius);

    this.ctx.fillStyle = '#e2e8f0';
    this.ctx.font = '14px monospace';
    this.ctx.fillText(`Tiempo: ${this.oscillator.getTime().toFixed(2)} s`, 20, 30);
    this.ctx.fillText(`Posición: ${this.oscillator.getPosition().toFixed(3)} m`, 20, 50);
    this.ctx.fillText(`Velocidad: ${this.oscillator.getVelocity().toFixed(3)} m/s`, 20, 70);
    this.ctx.fillText(`Aceleración: ${this.oscillator.getAcceleration().toFixed(3)} m/s²`, 20, 90);
    this.ctx.fillText(`Período: ${this.oscillator.getPeriod().toFixed(3)} s`, 20, 110);
  }

  private getMassRadius(oscillator: any): number{
    const M_min = 0.1;
    const M_max = 5.0;
    const R_min = 5;
    const R_max = 50;
    const masaActual = oscillator.getParameters()['Masa (m)'].value;
    const value = Math.max(M_min, Math.min(M_max, masaActual));

    // Mapeo lineal
    const mappedValue = ((value - M_min) / (M_max - M_min)) * (R_max - R_min) + R_min;

    return mappedValue;
  }

  // Dibuja la "Leyenda" de cada simulacion
  private drawElementsInfo(oscillator: any): void {
    const startX = 10;
    const startY = this.ctx.canvas.height - 120;
    const borderRadius = 5;
    let currentY = startY + 20;
    let elements: {color: string, label: string}[] = [];

    // Elementos comunes:
    elements.push({color: '#94a3b8', label: 'Pivote / Suspension'});

    if (!this.oscillator) return;

    if (oscillator instanceof MAS) {
      // Colores usados en renderMAS
      elements.push({color: 'rgba(59, 130, 246, 0.2)', label: 'Trayectoria'});
      elements.push({ color: '#3b82f6', label: 'Masa (m)' });
      elements.push({ color: '#64748b', label: 'Resorte' });
    } else if (oscillator instanceof PenduloCompuesto) {
      // Colores usados en renderPenduloCompuesto
      elements.push({ color: '#ef4444', label: 'Centro de Masa (CM)' }); // Rojo
      elements.push({ color: '#ea00ffff', label: 'Cuerpo Rígido' }); // Morado/Magenta
    } else if (oscillator instanceof PenduloSimple) {
      // Colores usados en renderPenduloSimple
      elements.push({ color: '#41f63bff', label: 'Masa Puntual (m)' }); // Azul
      elements.push({ color: '#64748b', label: 'Hilo' }); 
    }

    const boxHeight = elements.length * 20 + 30; 
    this.ctx.fillStyle = '#334155';
    this.roundRect(startX, startY, 250, boxHeight, borderRadius);

    this.ctx.fillStyle = '#e2e8f0';
    this.ctx.font = 'bold 14px monospace';
    this.ctx.fillText('Leyenda:', startX + 10, startY + 20);
    currentY += 15;

    this.ctx.font = '14px monospace';
    for (const item of elements) {
        this.ctx.fillStyle = item.color;
        this.ctx.beginPath();
        this.ctx.arc(startX + 20, currentY, 5, 0, 2 * Math.PI);
        this.ctx.fill();

        this.ctx.fillStyle = '#e2e8f0';
        this.ctx.fillText(item.label, startX + 35, currentY + 5);
        currentY += 20;
    }
  }

  // esto es mera mania mia que quiere dibujar rectangulos con un borderRadius asi q tenganme piedad pls
  private roundRect(x: number, y: number, w: number, h: number, r: number): void {
      const ctx = this.ctx;
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.arcTo(x + w, y, x + w, y + r, r); // Esquina superior derecha
      ctx.lineTo(x + w, y + h - r);
      ctx.arcTo(x + w, y + h, x + w - r, y + h, r); // Esquina inferior derecha
      ctx.lineTo(x + r, y + h);
      ctx.arcTo(x, y + h, x, y + h - r, r); // Esquina inferior izquierda
      ctx.lineTo(x, y + r);
      ctx.arcTo(x, y, x + r, y, r); // Esquina superior izquierda
      ctx.closePath();
      ctx.fill();
  }
}

