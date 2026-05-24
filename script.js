// Variables globales
let groqApiKey = null;
let appConfig = null;        // Guardará la configuración cargada
const chatMessages = document.getElementById('chatMessages');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const apiStatus = document.getElementById('apiStatus');

// URLs
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

// Cargar configuración primero
window.addEventListener('DOMContentLoaded', async () => {
    await loadConfig();
    askForApiKey();
});

// Carga config.json
async function loadConfig() {
    try {
        const response = await fetch('config.json');
        if (!response.ok) throw new Error('No se pudo cargar config.json');
        appConfig = await response.json();
        apiStatus.textContent = "✅ Configuración cargada · Esperando clave";
        apiStatus.style.backgroundColor = "#2e7d32";
        console.log("Configuración cargada:", appConfig);
    } catch (error) {
        console.error("Error cargando config:", error);
        apiStatus.textContent = "⚠️ Usando configuración por defecto";
        apiStatus.style.backgroundColor = "#b85c00";
        // Configuración por defecto segura
        appConfig = {
            system_prompt: "Eres Blancanieves. Hablas con dulzura y brevedad. Usa emojis de bosque (🍎, 🌲, 🐦, 🐿️).",
            model: "llama-3.1-8b-instant",
            temperature: 0.7,
            max_tokens: 150
        };
    }
}

function askForApiKey() {
    const key = prompt("🍎 Para hablar conmigo, necesito tu clave de API de Groq.\n\nPuedes obtenerla en https://console.groq.com\n\nIntroduce tu clave (empieza por gsk_):");
    if (key && key.trim().startsWith("gsk_")) {
        groqApiKey = key.trim();
        apiStatus.textContent = "✅ Clave activa · Bosque conectado";
        apiStatus.style.backgroundColor = "#2e7d32";
        userInput.disabled = false;
        sendBtn.disabled = false;
        userInput.focus();
        addBotMessage("🍎 ¡Perfecto! Ya podemos charlar. Cuéntame, ¿cómo está tu día?");
    } else {
        apiStatus.textContent = "❌ Clave no válida · Recarga la página para intentarlo de nuevo";
        apiStatus.style.backgroundColor = "#8b0000";
        addBotMessage("🍎 Lo siento, la clave no es correcta. Por favor, recarga la página y prueba con una clave válida de Groq.");
        userInput.disabled = true;
        sendBtn.disabled = true;
    }
}

function addBotMessage(text) {
    addMessage(text, false);
}

function addUserMessage(text) {
    addMessage(text, true);
}

function addMessage(text, isUser) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    messageDiv.classList.add(isUser ? 'user-message' : 'bot-message');

    const avatar = document.createElement('div');
    avatar.classList.add('avatar');
    avatar.textContent = isUser ? '👤' : '🍎';

    const bubble = document.createElement('div');
    bubble.classList.add('bubble');
    bubble.textContent = text;

    messageDiv.appendChild(avatar);
    messageDiv.appendChild(bubble);
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.id = 'typingIndicator';
    typingDiv.classList.add('message', 'bot-message');
    typingDiv.innerHTML = `<div class="avatar">🍎</div><div class="bubble">✍️ Escribiendo...</div>`;
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeTypingIndicator() {
    const typing = document.getElementById('typingIndicator');
    if (typing) typing.remove();
}

async function callGroqAPI(userMessage) {
    if (!appConfig) {
        return "🍎 El bosque aún no ha terminado de despertar. Espera un momento...";
    }

    const payload = {
        model: appConfig.model,
        messages: [
            { role: "system", content: appConfig.system_prompt },
            { role: "user", content: userMessage }
        ],
        temperature: appConfig.temperature,
        max_tokens: appConfig.max_tokens
    };

    try {
        const response = await fetch(GROQ_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${groqApiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || `Error ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error('Groq API error:', error);
        return `🍎 Oh, los animalitos del bosque no pudieron entregar tu mensaje. Error: ${error.message}. ¿Puedes repetirlo?`;
    }
}

async function sendMessage() {
    const message = userInput.value.trim();
    if (!message || !groqApiKey || !appConfig) return;

    userInput.disabled = true;
    sendBtn.disabled = true;

    addUserMessage(message);
    userInput.value = '';
    showTypingIndicator();

    const reply = await callGroqAPI(message);

    removeTypingIndicator();
    addBotMessage(reply);

    userInput.disabled = false;
    sendBtn.disabled = false;
    userInput.focus();
}

sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !userInput.disabled && groqApiKey && appConfig) {
        sendMessage();
    }
});