# Simulador de Dinámica Oscilatoria - RA4 Física II

Aplicación web educativa para simular y visualizar sistemas oscilatorios con metodología RA1 de resolución de problemas.

## Características

- **Tres tipos de sistemas oscilatorios:**
  - Movimiento Armónico Simple (MAS)
  - Péndulo Simple
  - Péndulo Compuesto

- **Visualización en tiempo real:**
  - Animación física con HTML5 Canvas
  - Gráficas dinámicas de posición, velocidad, aceleración y energía
  - Panel RA4 con metodología de resolución de problemas


- **Controles interactivos:**
  - Sliders para modificar parámetros físicos
  - Botones de control (Iniciar, Pausar, Reiniciar, Cámara Lenta)
  - Selector de tipo de sistema

## Tecnologías

- **TypeScript** - Lenguaje principal
- **HTML5 Canvas** - Animaciones
- **Chart.js** - Gráficas en tiempo real
- **TailwindCSS** - Interfaz de usuario
- **Vite** - Build tool y servidor de desarrollo

## Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Ejecutar en modo desarrollo:
```bash
npm run dev
```

3. Abrir en el navegador:
La aplicación se abrirá automáticamente en `http://localhost:3000`

## Construcción para producción

```bash
npm run build
```

Los archivos compilados estarán en la carpeta `dist/`.

## Estructura del Proyecto

```
src/
├── core/
│   └── physics.ts          # Clase base BaseOscillator
├── models/
│   ├── mas.ts              # Movimiento Armónico Simple
│   ├── penduloSimple.ts    # Péndulo Simple
│   └── penduloCompuesto.ts # Péndulo Compuesto
├── ui/
│   ├── controls.ts         # Controles interactivos
│   ├── charts.ts           # Sistema de gráficas
│   ├── renderer.ts         # Renderizador Canvas
│   └── RA1Panel.ts         # Panel metodología RA1
└── main.ts                 # Aplicación principal
```

## Metodología RA4

El simulador implementa la metodología RA4 de resolución de problemas:



1. **Identificación de datos conocidos** - Parámetros del sistema
2. **Identificación de incógnitas** - Variables a calcular
3. **Selección de ecuaciones físicas** - Ecuaciones relevantes
4. **Sustitución de valores y cálculo** - Cálculos paso a paso
5. **Interpretación física del resultado** - Análisis de resultados

## Uso

1. Seleccione el tipo de sistema oscilatorio desde el menú desplegable
2. Ajuste los parámetros físicos usando los sliders
3. Haga clic en "Iniciar" para comenzar la simulación
4. Observe la animación, gráficas y el panel RA1 actualizándose en tiempo real
5. Use "Pausar" para detener, "Reiniciar" para volver al inicio, y "Cámara Lenta" para análisis detallado

## Ecuaciones Implementadas

### Movimiento Armónico Simple (MAS)
- x(t) = A cos(ωt + φ)
- ω = √(k/m)
- v(t) = -Aω sin(ωt + φ)
- a(t) = -ω²x

### Péndulo Simple
- θ(t) ≈ θ₀ cos(ωt)
- ω = √(g/L)
- T = 2π√(L/g)

### Péndulo Compuesto
- θ(t) ≈ θ₀ cos(ωt)
- ω = √(mgd / I)
- T = 2π√(I / mgd)

## Licencia

Proyecto educativo para Física II - RA4


