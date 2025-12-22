import { BaseOscillator } from '../core/physics.js';
import { MAS } from '../models/mas.js';
import { PenduloSimple } from '../models/penduloSimple.js';
import { PenduloCompuesto } from '../models/penduloCompuesto.js';
// Nota: 'start' de 'repl' no se usa aquí y puede causar errores en navegador, lo he comentado por si acaso
// import { start } from 'repl'; 

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

    // Limpiar canvas (Fondo BLANCO para proyector)
    this.ctx.fillStyle = '#ffffff';
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

    // Dibujar resorte (Gris oscuro)
    this.ctx.strokeStyle = '#334155'; // slate-700
    this.ctx.lineWidth = 3;
    const springX = centerX - A * scale;
    const springLength = A * 2 * scale;
    this.drawSpring(springX, centerY, springLength, 20);

    // Dibujar pared (Gris medio)
    this.ctx.fillStyle = '#94a3b8'; // slate-400
    this.ctx.fillRect(springX - 20, centerY - 50, 20, 100);

    // Dibujar masa (Azul fuerte)
    const massX = centerX + x * scale;
    const massSize = this.getMassRadius(mas);    
    this.ctx.fillStyle = '#2563eb'; // blue-600
    this.ctx.beginPath();
    this.ctx.rect(massX - massSize / 2, centerY - massSize / 2, massSize, massSize);
    this.ctx.fill();
    this.ctx.strokeStyle = '#1e3a8a'; // blue-900 (borde)
    this.ctx.lineWidth = 2;
    this.ctx.stroke();

    // Dibujar línea de referencia (Gris punteado)
    this.ctx.strokeStyle = '#cbd5e1'; // slate-300
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

    // Dibujar hilo (Negro/Gris muy oscuro)
    this.ctx.strokeStyle = '#1e293b'; // slate-800
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(pivotX, pivotY);
    this.ctx.lineTo(massX, massY);
    this.ctx.stroke();

    // Dibujar punto de suspensión (Gris)
    this.ctx.fillStyle = '#64748b'; // slate-500
    this.ctx.beginPath();
    this.ctx.arc(pivotX, pivotY, 5, 0, 2 * Math.PI);
    this.ctx.fill();

    // Dibujar masa (Verde fuerte)
    const massSize = this.getMassRadius(pendulo);
    this.ctx.fillStyle = '#16a34a'; // green-600
    this.ctx.beginPath();
    this.ctx.arc(massX, massY, massSize, 0, 2 * Math.PI);
    this.ctx.fill();
    this.ctx.strokeStyle = '#14532d'; // green-900 (borde)
    this.ctx.lineWidth = 2;
    this.ctx.stroke();
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

    // Dibujar barra (Gris oscuro)
    this.ctx.strokeStyle = '#334155'; // slate-700
    this.ctx.lineWidth = 4;
    this.ctx.beginPath();
    this.ctx.moveTo(pivotX, pivotY);
    this.ctx.lineTo(cmX, cmY);
    this.ctx.stroke();

    // Dibujar punto de suspensión
    this.ctx.fillStyle = '#64748b'; // slate-500
    this.ctx.beginPath();
    this.ctx.arc(pivotX, pivotY, 6, 0, 2 * Math.PI);
    this.ctx.fill();

    // Dibujar cuerpo rígido (barra extendida) - MAGENTA OSCURO
    const barLength = d * scale * 1.5;
    const barEndX = pivotX + barLength * Math.sin(θ);
    const barEndY = pivotY + barLength * Math.cos(θ);

    this.ctx.strokeStyle = '#c026d3'; // fuchsia-600
    this.ctx.lineWidth = 6;
    this.ctx.beginPath();
    this.ctx.moveTo(pivotX, pivotY);
    this.ctx.lineTo(barEndX, barEndY);
    this.ctx.stroke();

    // Dibujar centro de masa (ROJO FUERTE)
    this.ctx.fillStyle = '#dc2626'; // red-600
    this.ctx.beginPath();
    this.ctx.arc(cmX, cmY, this.getMassRadius(pendulo), 0, 2 * Math.PI);
    this.ctx.fill();
    this.ctx.strokeStyle = '#7f1d1d'; // red-900
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
    // Azul claro semi-transparente para trayectoria
    this.ctx.strokeStyle = 'rgba(37, 99, 235, 0.4)'; // blue-600 con opacidad
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
  
  private drawPendulumTrajectory(pivotX: number, pivotY: number, radius: number): void {
    this.ctx.strokeStyle = 'rgba(37, 99, 235, 0.2)';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.arc(pivotX, pivotY, radius, -0.5, 0.5);
    this.ctx.stroke();
  }

  // Dibuja la informacion de cada simulacion en tiempo real
  private drawInfo(): void {
    const borderRadius = 5;

    if (!this.oscillator) return;

    // Caja de info: Fondo blanco (casi transparente) con borde gris
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    this.ctx.strokeStyle = '#cbd5e1'; // Borde slate-300
    this.ctx.lineWidth = 1;
    
    // Primero dibujamos el rectángulo para usarlo como path del stroke
    this.roundRect(10, 10, 250, 120, borderRadius); 
    this.ctx.stroke(); // Dibujar borde

    // Texto NEGRO
    this.ctx.fillStyle = '#0f172a'; // slate-900
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

    // Elementos comunes (Color Gris Oscuro):
    elements.push({color: '#64748b', label: 'Pivote / Suspension'});

    if (!this.oscillator) return;

    if (oscillator instanceof MAS) {
      elements.push({color: 'rgba(37, 99, 235, 0.4)', label: 'Trayectoria'});
      elements.push({ color: '#2563eb', label: 'Masa (m)' }); // Azul
      elements.push({ color: '#334155', label: 'Resorte' }); // Gris Oscuro
    } else if (oscillator instanceof PenduloCompuesto) {
      elements.push({ color: '#dc2626', label: 'Centro de Masa (CM)' }); // Rojo
      elements.push({ color: '#c026d3', label: 'Cuerpo Rígido' }); // Magenta
    } else if (oscillator instanceof PenduloSimple) {
      elements.push({ color: '#16a34a', label: 'Masa Puntual (m)' }); // Verde
      elements.push({ color: '#1e293b', label: 'Hilo' }); // Negro
    }

    const boxHeight = elements.length * 20 + 30; 
    
    // Caja Leyenda: Fondo blanco semi-transparente
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    this.ctx.strokeStyle = '#cbd5e1';
    this.ctx.lineWidth = 1;
    
    this.roundRect(startX, startY, 250, boxHeight, borderRadius);
    this.ctx.stroke(); // Borde

    // Título Leyenda en NEGRO
    this.ctx.fillStyle = '#0f172a';
    this.ctx.font = 'bold 14px monospace';
    this.ctx.fillText('Leyenda:', startX + 10, startY + 20);
    currentY += 15;

    this.ctx.font = '14px monospace';
    for (const item of elements) {
        this.ctx.fillStyle = item.color;
        this.ctx.beginPath();
        this.ctx.arc(startX + 20, currentY, 5, 0, 2 * Math.PI);
        this.ctx.fill();

        // Texto de items en GRIS OSCURO
        this.ctx.fillStyle = '#334155';
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