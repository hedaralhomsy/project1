document.addEventListener('DOMContentLoaded', (event) => {
    const welcomeMessage = "Welcome to the Chatbot! How can I assist you today?";
    appendMessage('bot-message', welcomeMessage);
});

async function fetchAIResponse(prompt) {
    const api_key = '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';  // استبدلها بمفتاح API الخاص بك
    const api_url = 'https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill';

    const response = await fetch(api_url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${api_key}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            inputs: prompt  // تأكد من تنسيق البيانات بشكل صحيح
        })
    });

    if (!response.ok) {
        console.error('Error:', response.statusText);
        appendMessage('bot-message', 'Error: Unable to fetch response from API.');
        return 'No response received';
    }

    const data = await response.json();
    console.log('API Response:', data);
    if (data && data[0] && data[0].generated_text) {
        return data[0].generated_text;  // تحقق من بنية البيانات واستخراج النص بشكل صحيح
    } else {
        return 'No response received';
    }
}

async function sendMessage() {
    const userInput = document.getElementById('input').value;
    if (userInput.trim() === '') return;
    appendMessage('user-message', userInput);
    document.getElementById('input').value = '';

    setTimeout(async () => {
        const botResponse = await fetchAIResponse(userInput);
        appendMessage('bot-message', botResponse);

        // تحقق من استجابة الخادم للتحكم بعدد الرسائل
        const response = await fetch('/send_message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: userInput })
        });
        const data = await response.json();
        if (data.redirect) {
            window.location.href = data.redirect;  // إعادة توجيه المستخدم إلى صفحة تسجيل الدخول
        } else if (data.message) {
            console.log('Message sent successfully:', data.message);
        } else {
            console.error('No response received from server');
            appendMessage('bot-message', 'Error: No response received from server.');
        }
    }, 500);
}

function appendMessage(messageClass, message) {
    const chatBox = document.getElementById('chat-box');
    const messageElement = document.createElement('div');
    messageElement.classList.add('chat-message', messageClass);
    messageElement.textContent = message;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight; // Scroll to the bottom
}

function resetChat() {
    const chatBox = document.getElementById('chat-box');
    chatBox.innerHTML = '';
    const welcomeMessage = "Welcome to the Chatbot! How can I assist you today?";
    appendMessage('bot-message', welcomeMessage);
}

// وظيفة saveChatHistory لن تستخدم حالياً
function saveChatHistory(userMessage, botMessage) {
    const chatHistory = document.getElementById('chat-history');
    if (chatHistory) {
        const chatItem = document.createElement('li');
        chatItem.textContent = `User: ${userMessage} | Bot: ${botMessage}`;
        chatHistory.appendChild(chatItem);
    } else {
        console.error('chat-history element not found');
    }
}
