# OptiProd

OptiProd es una aplicación web interactiva que permite simular cómo una PyME puede encontrar la cantidad ideal de producción para maximizar sus utilidades utilizando conceptos de cálculo diferencial.

## 📌 Descripción del proyecto

Este proyecto fue desarrollado como parte de la Prueba 3 de Cálculo Diferencial y muestra de manera visual cómo varían los resultados al modificar parámetros como:

- precio de venta
- sensibilidad de la demanda
- costo variable por unidad
- costo fijo mensual

La aplicación calcula de forma automática la cantidad óptima de producción, el precio sugerido y la utilidad máxima, además de mostrar una gráfica de utilidad en tiempo real.

## ✨ Funcionalidades

- Simulación de distintos tipos de negocio:
  - Panadería
  - Textil
  - Cafetería
  - Cosméticos
- Ajuste de parámetros mediante inputs y sliders
- Cambio de escenarios predefinidos:
  - Estándar
  - Demanda alta
  - Costos bajos
- Visualización de resultados matemáticos:
  - Cantidad óptima
  - Precio sugerido
  - Ingreso total
  - Costo total
  - Utilidad máxima
  - Derivada y segunda derivada
- Gráfica interactiva de utilidad

## 🧠 Concepto matemático aplicado

El proyecto utiliza un modelo de utilidad de la forma:

$$U(x) = (a - c)x - b x^2 - F$$

donde:

- $x$ = cantidad producida o vendida
- $a$ = precio base de venta
- $b$ = sensibilidad de la demanda
- $c$ = costo variable por unidad
- $F$ = costo fijo mensual

Para encontrar el punto óptimo, se deriva la función y se iguala a cero:

$$U'(x) = a - c - 2bx$$

Luego se verifica que:

$$U''(x) = -2b < 0$$

lo cual indica que se trata de un máximo.

## 📁 Estructura de archivos

- index.html: estructura principal de la interfaz
- styles.css: estilos visuales y diseño responsive
- script.js: lógica de cálculo, renderizado de resultados y gráfica
- README.md: documentación del proyecto

## ▶️ Cómo usar

1. Abre el archivo index.html en tu navegador.
2. Selecciona el tipo de negocio que deseas simular.
3. Ajusta los parámetros del modelo.
4. Presiona el botón “Calcular ahora” o modifica los valores para ver los cambios en tiempo real.
5. Observa la gráfica y los resultados obtenidos.

## 🛠️ Tecnologías utilizadas

- HTML5
- CSS3
- JavaScript
- Canvas para la gráfica

## 👤 Autor

Proyecto elaborado por Alejandro Belvie.

## 📝 Notas

Este proyecto está pensado como una herramienta educativa para comprender la aplicación del cálculo diferencial en problemas de optimización empresarial.
# prueba_calculo
# prueba_calculo
