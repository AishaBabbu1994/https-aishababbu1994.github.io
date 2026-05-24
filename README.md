# Blancanieves · El bosque encantado

Chatbot interactivo de Blancanieves usando la API de Groq. Totalmente estático y listo para GitHub Pages.

## Despliegue en GitHub Pages

1. Sube todos estos archivos a un repositorio en GitHub:
   - `index.html`
   - `style.css`
   - `script.js`
   - `config.json`
   - `README.md` (opcional)

2. En el repositorio, ve a **Settings > Pages**.
3. En "Branch", selecciona `main` (o `master`) y la carpeta `/root`.
4. Haz clic en **Save**.
5. En unos minutos tu sitio estará disponible en `https://tuusuario.github.io/nombre-repositorio`.

## Uso

- Al cargar la página, se pedirá tu **clave de API de Groq** (empieza por `gsk_`). Puedes obtener una gratis en [console.groq.com](https://console.groq.com).
- La configuración se carga desde `config.json`. Puedes editar el `system_prompt`, el modelo, temperatura y `max_tokens` sin tocar el código.
- El modelo por defecto es `llama-3.1-8b-instant` (rápido y gratuito).

## Personalización

Cambia el personaje o el estilo editando:
- `config.json`: modifica el `system_prompt` y los parámetros de la IA.
- `style.css`: colores, fondos, burbujas.
- `script.js`: avatares, mensajes iniciales, etc.

## Nota

La clave de API se guarda solo en la memoria del navegador mientras dura la sesión. No se almacena en ningún servidor.
