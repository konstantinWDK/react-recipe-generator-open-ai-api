# Generador de Recetas

## Descripción

**Generador de Recetas** es una aplicación web desarrollada con **React** que permite a los usuarios seleccionar ingredientes de diversas categorías y generar recetas personalizadas basadas en sus selecciones. La aplicación se comunica con un servidor **backend** para procesar las solicitudes y devolver recetas detalladas utilizando la API de **OpenAI**.

## Características

- **Selección de Ingredientes:** Organiza los ingredientes en categorías como Proteínas, Lácteos, Vegetales, Frutas, Granos y Cereales, Frutos secos y semillas, Especias y condimentos, y Líquidos.
- **Generación de Recetas:** Al seleccionar los ingredientes deseados, la aplicación genera una receta completa con título e instrucciones detalladas.
- **Interfaz Intuitiva:** Diseño responsivo y amigable que facilita la navegación y la interacción del usuario.
- **Gestión de Pasos:** Las instrucciones de la receta se dividen en pasos que los usuarios pueden marcar como completados.
- **Indicador de Carga:** Muestra un indicador mientras se genera la receta, mejorando la experiencia del usuario.

## Tecnologías Utilizadas

- **Frontend:**
  - React
  - Axios para solicitudes HTTP
  - Tailwind CSS para estilos

- **Backend:**
  - Node.js
  - Express
  - Axios para comunicación con la API de OpenAI

## Instalación

### Prerrequisitos

- **Node.js** y **npm** instalados en tu máquina.
- **Git** para clonar el repositorio.
- **Cuenta en OpenAI** para obtener una clave API.

### Pasos para Configurar el Proyecto Localmente

1. **Clonar el Repositorio:**

   Abre tu terminal y ejecuta el siguiente comando para clonar el repositorio:

   ```bash
   git clone https://github.com/konstantinWDK/react-recipe-generator-open-ai-api.git

2. **Iniciar Repositorio:**
    
  - npm start
  - /backend npm start

3. **Ingresar la API de Open IA**
    En el archivo .env en la raiz y en backend (añadir puerto)
    - REACT_APP_OPENAI_API_KEY="clave-API sin comillas"
    - PORT=5000

