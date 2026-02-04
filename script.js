// Elementos do DOM
const fetchBtn = document.getElementById('fetchBtn');
const responseContainer = document.getElementById('response');
const statusDot = document.getElementById('statusDot');
const statusText = document.getElementById('statusText');

const API_URL = 'http://localhost:3333';

// Função para chamar a API
async function callAPI() {
    fetchBtn.disabled = true;
    responseContainer.innerHTML = '<div class="loading"></div><div class="loading"></div><div class="loading"></div>';
    
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        
        // Exibir resposta
        displayResponse(data, true);
        updateStatus(true);
        
    } catch (error) {
        console.error('Erro ao conectar:', error);
        displayResponse({
            erro: 'Não foi possível conectar ao servidor',
            detalhes: error.message
        }, false);
        updateStatus(false);
    } finally {
        fetchBtn.disabled = false;
    }
}

// Função para exibir a resposta
function displayResponse(data, success) {
    responseContainer.classList.remove('success', 'error');
    
    if (success) {
        responseContainer.classList.add('success');
        responseContainer.innerHTML = `
            <div>
                <strong>✓ Resposta da API:</strong><br>
                ${JSON.stringify(data, null, 2)}
            </div>
        `;
    } else {
        responseContainer.classList.add('error');
        responseContainer.innerHTML = `
            <div>
                <strong>✗ Erro:</strong><br>
                ${JSON.stringify(data, null, 2)}
            </div>
        `;
    }
}

// Função para atualizar o status de conexão
function updateStatus(connected) {
    if (connected) {
        statusDot.classList.add('connected');
        statusText.textContent = '✓ Conectado ao servidor';
        statusText.style.color = 'var(--success-color)';
    } else {
        statusDot.classList.remove('connected');
        statusText.textContent = '✗ Servidor não está respondendo';
        statusText.style.color = 'var(--danger-color)';
    }
}

// Função para verificar a conexão ao carregar a página
async function checkConnection() {
    try {
        const response = await fetch(API_URL);
        if (response.ok) {
            updateStatus(true);
        } else {
            updateStatus(false);
        }
    } catch (error) {
        updateStatus(false);
    }
}

// Event listeners
fetchBtn.addEventListener('click', callAPI);

// Verificar conexão ao carregar
window.addEventListener('load', checkConnection);

// Verificar conexão a cada 10 segundos
setInterval(checkConnection, 10000);