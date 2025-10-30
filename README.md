# Stack Game Challenge 🎮

Un juego de apilamiento de cajas desarrollado con JavaScript vanilla y Canvas API. El objetivo es apilar cajas una sobre otra con la mayor precisión posible para lograr la puntuación más alta.

## 🎯 Descripción

Stack Game es un juego arcade donde debes apilar cajas en movimiento. Cada caja se mueve horizontalmente de lado a lado, y debes cronometrar perfectamente tu clic para dejarla caer sobre la caja anterior. Si fallas completamente, ¡pierdes! La parte que no se superponga se cortará, haciendo cada vez más difícil apilar las siguientes cajas.

## 🎮 Controles

- **ESPACIO** o **CLICK/TAP**: Soltar la caja en movimiento
- **P** o **ESC**: Pausar/Reanudar el juego
- **CLICK** (en Game Over): Reiniciar el juego

## 🚀 Cómo Jugar

1. Abre el archivo `index.html` en tu navegador
2. La primera caja está estática, las siguientes se moverán horizontalmente
3. Presiona ESPACIO o haz clic para soltar la caja en movimiento
4. Intenta alinear la caja lo mejor posible con la anterior
5. La parte que sobresale se cortará (mostrada en rojo)
6. Continúa apilando hasta que falles completamente
7. ¡Intenta conseguir la puntuación más alta!

## 💻 Tecnologías Utilizadas

- HTML5
- CSS3
- JavaScript (ES6+)
- Canvas API

## ✨ Características

- ✅ Canvas responsive que se adapta a diferentes tamaños de pantalla
- ✅ Sistema de colores aleatorios para cada caja
- ✅ Dificultad progresiva (las cajas se mueven más rápido)
- ✅ Visualización de debris (partes cortadas)
- ✅ Sistema de cámara con scroll automático
- ✅ Controles táctiles y de teclado
- ✅ Sistema de puntuación máxima persistente (localStorage)
- ✅ Sistema de pausa (tecla P o ESC)
- ✅ Instrucciones en pantalla para nuevos jugadores
- ✅ Interfaz mejorada con mensajes y feedback visual

## 📦 Instalación y Uso

1. Clona este repositorio:
```bash
git clone https://github.com/FrontEdd/stack-game-challenge.git
```

2. Navega al directorio:
```bash
cd stack-game-challenge
```

3. Abre el archivo `index.html` en tu navegador favorito:
```bash
# Opción 1: Abre directamente el archivo
open index.html

# Opción 2: Usa un servidor local
npx serve
```

## 🎨 Estructura del Proyecto

```
stack-game-js/
│
├── index.html      # Estructura HTML del juego
├── styles.css      # Estilos y diseño responsive
├── game.js         # Lógica del juego
└── README.md       # Documentación
```

## 🔧 Desarrollo

Este proyecto fue desarrollado como un desafío de programación para practicar:
- Manipulación del Canvas API
- Lógica de juegos 2D
- Detección de colisiones
- Gestión de estado en JavaScript
- Diseño responsive

## 📝 Historial de Desarrollo

### Versión Inicial
El proyecto fue desarrollado de forma incremental siguiendo estas etapas:

1. Estructura HTML y estilos básicos
2. Constantes importantes del juego
3. Estado inicial y renderizado en canvas
4. Sistema de creación de cajas y colisiones
5. Implementación de colores aleatorios
6. Sistema de caída de cajas
7. Actualización de cámara en el eje Y
8. Visualización de debris (partes cortadas)
9. Configuración de controles y Game Over
10. Contador de puntuación

### Mejoras y Refactorización
El proyecto fue mejorado con las siguientes actualizaciones:

1. **Refactorización**: Separación de CSS y JavaScript en archivos externos
2. **Responsive**: Canvas adaptable a diferentes tamaños de pantalla
3. **Documentación**: README mejorado con instrucciones completas
4. **Bug Fix**: Corrección del sistema de colores aleatorios
5. **Optimización**: Renderizado optimizado de debris
6. **High Score**: Sistema de puntuación máxima con localStorage
7. **UX**: Instrucciones en pantalla y mensajes de retroalimentación
8. **Mantenibilidad**: Extracción de valores mágicos a constantes
9. **Funcionalidad**: Sistema de pausa con teclas P/ESC

## 🌐 Demo en Vivo

Puedes jugar la versión en vivo aquí: [Stack Game Challenge](https://frontedd.github.io/stack-game-challenge/)

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 👨‍💻 Autor

**Edgar** - [FrontEdd](https://github.com/FrontEdd)

---

¡Diviértete jugando y no olvides compartir tu mejor puntuación! 🏆
