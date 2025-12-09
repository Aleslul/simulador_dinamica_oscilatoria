declare module 'chart.js' {
  export interface ChartConfiguration {
    type?: string;
    data?: any;
    options?: any;
  }

  export class Chart {
    constructor(ctx: CanvasRenderingContext2D | HTMLCanvasElement, config: ChartConfiguration);
    data: any;
    update(mode?: string): void;
    destroy(): void;
  }
}

