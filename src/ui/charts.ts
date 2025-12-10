import { BaseOscillator } from '../core/physics.js';

// Chart.js se carga desde CDN, disponible globalmente
declare const Chart: any;

/**
 * Sistema de gráficas en tiempo real usando Chart.js
 */
export class Charts {
  //TODO: Agregando limitacion de frames
  private lastChartUpdate: number = 0;
  private updateIntervalMS: number = 100;

  private positionChart: any = null;
  private velocityChart: any = null;
  private accelerationChart: any = null;
  private energyChart: any = null;
  private maxDataPoints: number = 100;
  private timeData: number[] = [];
  private positionData: number[] = [];
  private velocityData: number[] = [];
  private accelerationData: number[] = [];
  private kineticEnergyData: number[] = [];
  private potentialEnergyData: number[] = [];
  private totalEnergyData: number[] = [];

  constructor() {
    this.initializeCharts();
  }

  private initializeCharts(): void {
    const commonConfig: any = {
      type: 'line',
      options: {
        responsive: true,
        maintainAspectRatio: true,
        animation: false,
        scales: {
          x: {
            type: 'linear',
            title: {
              display: true,
              text: 'Tiempo (s)',
              color: '#e2e8f0'
            },
            ticks: { color: '#cbd5e1' },
            grid: { color: '#475569' },
          },
          y: {
            title: {
              display: true,
              color: '#e2e8f0'
            },
            ticks: { color: '#cbd5e1' },
            grid: { color: '#475569' },
            suggestedMin: -10.0,
            suggestedMax: 10.0,
          }
        },
        plugins: {
          legend: {
            labels: { color: '#e2e8f0' }
          }
        }
      }
    };

    // Gráfica de Posición
    const positionCtx = document.getElementById('positionChart') as HTMLCanvasElement;
    if (positionCtx) {
      this.positionChart = new Chart(positionCtx, {
        ...commonConfig,
        data: {
          datasets: [{
            label: 'Posición (m)',
            data: [],
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            tension: 0.4
          }]
        },
        options: {
          ...commonConfig.options,
          scales: {
            ...commonConfig.options?.scales,
            y: {
              ...commonConfig.options?.scales?.y,
              title: {
                display: true,
                text: 'Posición (m)',
                color: '#e2e8f0'
              }
            }
          }
        }
      });
    }

    // Gráfica de Velocidad
    const velocityCtx = document.getElementById('velocityChart') as HTMLCanvasElement;
    if (velocityCtx) {
      this.velocityChart = new Chart(velocityCtx, {
        ...commonConfig,
        data: {
          datasets: [{
            label: 'Velocidad (m/s)',
            data: [],
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            tension: 0.4
          }]
        },
        options: {
          ...commonConfig.options,
          scales: {
            ...commonConfig.options?.scales,
            y: {
              ...commonConfig.options?.scales?.y,
              title: {
                display: true,
                text: 'Velocidad (m/s)',
                color: '#e2e8f0'
              }

            }
          }
        }
      });
    }

    // Gráfica de Aceleración
    const accelerationCtx = document.getElementById('accelerationChart') as HTMLCanvasElement;
    if (accelerationCtx) {
      this.accelerationChart = new Chart(accelerationCtx, {
        ...commonConfig,
        data: {
          datasets: [{
            label: 'Aceleración (m/s²)',
            data: [],
            borderColor: '#f59e0b',
            backgroundColor: 'rgba(245, 158, 11, 0.1)',
            tension: 0.4
          }]
        },
        options: {
          ...commonConfig.options,
          scales: {
            ...commonConfig.options?.scales,
            y: {
              ...commonConfig.options?.scales?.y,
              title: {
                display: true,
                text: 'Aceleración (m/s²)',
                color: '#e2e8f0'
              }
            }
          }
        }
      });
    }

    // Gráfica de Energía
    const energyCtx = document.getElementById('energyChart') as HTMLCanvasElement;
    if (energyCtx) {
      this.energyChart = new Chart(energyCtx, {
        ...commonConfig,
        data: {
          datasets: [
            {
              label: 'Energía Cinética (J)',
              data: [],
              borderColor: '#ef4444',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              tension: 0.4
            },
            {
              label: 'Energía Potencial (J)',
              data: [],
              borderColor: '#8b5cf6',
              backgroundColor: 'rgba(139, 92, 246, 0.1)',
              tension: 0.4
            },
            {
              label: 'Energía Total (J)',
              data: [],
              borderColor: '#06b6d4',
              backgroundColor: 'rgba(6, 182, 212, 0.1)',
              tension: 0.4
            }
          ]
        },
        options: {
          ...commonConfig.options,
          scales: {
            ...commonConfig.options?.scales,
            y: {
              ...commonConfig.options?.scales?.y,
              title: {
                display: true,
                text: 'Energía (J)',
                color: '#e2e8f0'
              }
            }
          }
        }
      });
    }
  }

  update(oscillator: BaseOscillator): void {
    const currentTime = performance.now();
    if (currentTime - this.lastChartUpdate < this.updateIntervalMS) {
      this.addData(oscillator);
      return;
    }

    this.lastChartUpdate = currentTime;
    this.addData(oscillator);

    // Actualizar gráficas
    if (this.positionChart) {
      this.positionChart.data.datasets[0].data = this.timeData.map((t, i) => ({ x: t, y: this.positionData[i] }));
      this.positionChart.update('none');
    }

    if (this.velocityChart) {
      this.velocityChart.data.datasets[0].data = this.timeData.map((t, i) => ({ x: t, y: this.velocityData[i] }));
      this.velocityChart.update('none');
    }

    if (this.accelerationChart) {
      this.accelerationChart.data.datasets[0].data = this.timeData.map((t, i) => ({ x: t, y: this.accelerationData[i] }));
      this.accelerationChart.update('none');
    }

    if (this.energyChart) {
      this.energyChart.data.datasets[0].data = this.timeData.map((t, i) => ({ x: t, y: this.kineticEnergyData[i] }));
      this.energyChart.data.datasets[1].data = this.timeData.map((t, i) => ({ x: t, y: this.potentialEnergyData[i] }));
      this.energyChart.data.datasets[2].data = this.timeData.map((t, i) => ({ x: t, y: this.totalEnergyData[i] }));
      this.energyChart.update('none');
    }
  }

  clear(): void {
    this.timeData = [];
    this.positionData = [];
    this.velocityData = [];
    this.accelerationData = [];
    this.kineticEnergyData = [];
    this.potentialEnergyData = [];
    this.totalEnergyData = [];

    if (this.positionChart) {
      this.positionChart.data.datasets[0].data = [];
      this.positionChart.update();
    }
    if (this.velocityChart) {
      this.velocityChart.data.datasets[0].data = [];
      this.velocityChart.update();
    }
    if (this.accelerationChart) {
      this.accelerationChart.data.datasets[0].data = [];
      this.accelerationChart.update();
    }
    if (this.energyChart) {
      this.energyChart.data.datasets[0].data = [];
      this.energyChart.data.datasets[1].data = [];
      this.energyChart.data.datasets[2].data = [];
      this.energyChart.update();
    }
  }

  private addData(oscillator: BaseOscillator): void {
    const t = oscillator.getTime();
    const x = oscillator.getPosition();
    const v = oscillator.getVelocity();
    const a = oscillator.getAcceleration();
    const Ec = oscillator.getKineticEnergy();
    const Ep = oscillator.getPotentialEnergy();
    const Et = oscillator.getTotalEnergy();

        // Agregar nuevos datos
    this.timeData.push(t);
    this.positionData.push(x);
    this.velocityData.push(v);
    this.accelerationData.push(a);
    this.kineticEnergyData.push(Ec);
    this.potentialEnergyData.push(Ep);
    this.totalEnergyData.push(Et);

    
    // Limitar el número de puntos de datos
    if (this.timeData.length > this.maxDataPoints) {
      this.timeData.shift();
      this.positionData.shift();
      this.velocityData.shift();
      this.accelerationData.shift();
      this.kineticEnergyData.shift();
      this.potentialEnergyData.shift();
      this.totalEnergyData.shift();
    }
  }
}

