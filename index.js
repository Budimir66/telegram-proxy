const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

// ===== НАСТРОЙКИ =====
const RUSSIAN_SERVER = process.env.RUSSIAN_SERVER || 'https://твой-сервер.ru';
const PORT = process.env.PORT || 8080;

console.log(`✅ Прокси запущен. Сервер: ${RUSSIAN_SERVER}`);

// ===== ПРОКСИ ДЛЯ MAX =====
app.post('/webhook/max', async (req, res) => {
    console.log('📩 [Railway] Получен запрос от MAX');
    console.log('📩 Body:', JSON.stringify(req.body).substring(0, 300));
    
    try {
        const response = await axios.post(
            `${RUSSIAN_SERVER}/api/bot/handle`,
            req.body,
            { timeout: 30000 }
        );
        console.log('✅ Ответ отправлен');
        res.json(response.data);
    } catch (error) {
        console.error('❌ Ошибка проксирования MAX:', error.message);
        res.status(500).json({ error: 'Proxy error', message: error.message });
    }
});

// ===== ПРОКСИ ДЛЯ TELEGRAM =====
app.post('/webhook/telegram', async (req, res) => {
    console.log('📩 [Railway] Получен запрос от Telegram');
    console.log('📩 Body:', JSON.stringify(req.body).substring(0, 300));
    
    try {
        const response = await axios.post(
            `${RUSSIAN_SERVER}/api/bot/handle`,
            req.body,
            { timeout: 30000 }
        );
        console.log('✅ Ответ отправлен в Telegram');
        res.json(response.data);
    } catch (error) {
        console.error('❌ Ошибка проксирования Telegram:', error.message);
        res.status(500).json({ error: 'Proxy error', message: error.message });
    }
});

// ===== ПРОВЕРКА ЗДОРОВЬЯ =====
app.get('/', (req, res) => {
    res.send('✅ Telegram/MAX Proxy is running!');
});

app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        server: RUSSIAN_SERVER,
        timestamp: new Date().toISOString()
    });
});

app.listen(PORT, () => {
    console.log(`✅ Proxy running on port ${PORT}`);
    console.log(`📍 Сервер: ${RUSSIAN_SERVER}`);
});
