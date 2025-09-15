# Sistema de Inventario de Alimentos del Hogar

Una aplicación web moderna para gestionar el inventario de alimentos de tu hogar. Realiza un seguimiento de los artículos, las fechas de caducidad y obtén sugerencias de recetas impulsadas por IA basadas en lo que tienes.

## ✨ Características

- **Gestión de Inventario:** Añade, edita, elimina y ajusta las cantidades de los alimentos.
- **Información Detallada:** Registra nombre, tipo de alimento, marca, fecha de caducidad, cantidad, unidad y ubicación.
- **Gestión de Ubicaciones (CRUD):** Crea, lee, actualiza y elimina ubicaciones de almacenamiento personalizadas (ej. Despensa, Refrigerador, Estante de especias).
- **Sugerencias de Recetas con IA:** Obtén ideas de recetas de Gemini basadas en tu inventario actual.
- **Historial de Movimientos:** Visualiza un registro de todas las adiciones, usos y descartes.
- **Alertas Inteligentes:** Recibe notificaciones sobre artículos caducados y agotados.
- **Reportes y Estadísticas:**
  - Gráfico de consumo de los últimos 7 días.
  - Exporta tu inventario a formatos PDF y Excel.
- **Diseño Responsivo:** Funciona perfectamente en computadoras de escritorio y dispositivos móviles.
- **Modo Oscuro:** Se adapta a las preferencias de tu sistema.

## 🛠️ Tecnologías Utilizadas

- **Frontend:** React, TypeScript, Tailwind CSS
- **Inteligencia Artificial:** Google Gemini API
- **Exportación de Datos:** jsPDF, SheetJS (XLSX)

## 🚀 Cómo Empezar y Ejecutar Localmente

Sigue estos pasos para configurar y ejecutar el proyecto en tu máquina local.

### Prerrequisitos

- Un navegador web moderno (Chrome, Firefox, Safari, Edge).
- Una clave de API de Google Gemini.

### Pasos para la Instalación

1.  **Clona o Descarga el Repositorio**

    Si tienes `git` instalado, puedes clonar el repositorio. De lo contrario, puedes descargar los archivos como un archivo ZIP desde GitHub.

    ```bash
    git clone https://github.com/tu-usuario/nombre-del-repo.git
    cd nombre-del-repo
    ```

2.  **Obtén tu Clave de API de Gemini**

    - Ve a [Google AI Studio](https://aistudio.google.com/app/apikey).
    - Haz clic en "Create API key" para generar una nueva clave.
    - Copia la clave de API. La necesitarás en el siguiente paso.

3.  **Configura la Clave de API**

    a. **Busca el archivo `local.js`** en la carpeta del proyecto.

    b. **Abre `local.js` y reemplaza el texto `"TU_API_KEY_AQUI"`** con la clave de API que obtuviste en el paso anterior. El archivo debería quedar así:

    ```javascript
    // local.js
    window.process = {
      env: {
        API_KEY: "ey...tu-clave-aqui...w" // Pega tu clave real aquí
      }
    };
    ```
    **Importante:** Este archivo está configurado para ser ignorado por git (a través de `.gitignore`) para evitar que subas tu clave secreta a un repositorio público por accidente.

4.  **Ejecuta la Aplicación**

    Dado que la aplicación utiliza módulos de JavaScript (`type="module"`), no puedes simplemente abrir el archivo `index.html` directamente en tu navegador desde el sistema de archivos. Necesitas servirlo desde un servidor web local. Aquí tienes algunas opciones fáciles:

    **Opción A: Usando la extensión "Live Server" en VS Code**
    - Si usas Visual Studio Code, instala la extensión [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer).
    - Haz clic derecho en el archivo `index.html` y selecciona "Open with Live Server".

    **Opción B: Usando Python**
    - Abre tu terminal en la carpeta del proyecto.
    - Si tienes Python 3, ejecuta:
      ```bash
      python -m http.server
      ```
    - Abre tu navegador y ve a `http://localhost:8000`.

    **Opción C: Usando Node.js**
    - Asegúrate de tener Node.js instalado.
    - Abre tu terminal en la carpeta del proyecto.
    - Instala un servidor simple globalmente (solo necesitas hacerlo una vez):
      ```bash
      npm install -g serve
      ```
    - Ejecuta el servidor:
      ```bash
      serve .
      ```
    - Abre tu navegador y ve a la dirección que te indique la terminal (usualmente `http://localhost:3000`).

¡Y eso es todo! La aplicación debería estar funcionando en tu navegador, lista para que la pruebes.
