(function () {
  // Create widget container
  const container = document.createElement('div');
  container.id = 'chatbot-widget-container';
  container.style.position = 'fixed';
  container.style.bottom = '20px';
  container.style.right = '20px';
  container.style.zIndex = '9999';
  document.body.appendChild(container);

  // Get the AI ID and determine base URL from the script tag
  const script = document.currentScript;
  const aiId = script?.getAttribute('data-ai-id');
  // Get base URL from the script src
  const scriptUrl = new URL(script.src);
  const baseUrl = 'https://red-delight-414207.uc.r.appspot.com';

  if (!aiId) {
    console.error('No AI ID provided in data-ai-id attribute');
    return;
  }

  console.log('Initializing chatbot with base URL:', baseUrl);

  // Create toggle button
  const toggleButton = document.createElement('button');
  toggleButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-robot" viewBox="0 0 16 16">
  <path d="M6 12.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5M3 8.062C3 6.76 4.235 5.765 5.53 5.886a26.6 26.6 0 0 0 4.94 0C11.765 5.765 13 6.76 13 8.062v1.157a.93.93 0 0 1-.765.935c-.845.147-2.34.346-4.235.346s-3.39-.2-4.235-.346A.93.93 0 0 1 3 9.219zm4.542-.827a.25.25 0 0 0-.217.068l-.92.9a25 25 0 0 1-1.871-.183.25.25 0 0 0-.068.495c.55.076 1.232.149 2.02.193a.25.25 0 0 0 .189-.071l.754-.736.847 1.71a.25.25 0 0 0 .404.062l.932-.97a25 25 0 0 0 1.922-.188.25.25 0 0 0-.068-.495c-.538.074-1.207.145-1.98.189a.25.25 0 0 0-.166.076l-.754.785-.842-1.7a.25.25 0 0 0-.182-.135"/>
  <path d="M8.5 1.866a1 1 0 1 0-1 0V3h-2A4.5 4.5 0 0 0 1 7.5V8a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1v1a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1v-.5A4.5 4.5 0 0 0 10.5 3h-2zM14 7.5V13a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7.5A3.5 3.5 0 0 1 5.5 4h5A3.5 3.5 0 0 1 14 7.5"/>
</svg>`;
  toggleButton.style.padding = '10px 20px';
  toggleButton.style.backgroundColor = '#0070f3';
  toggleButton.style.color = 'white';
  toggleButton.style.border = 'none';
  toggleButton.style.borderRadius = '5px';
  toggleButton.style.cursor = 'pointer';
  container.appendChild(toggleButton);

  // Create chat container
  const chatContainer = document.createElement('div');
  chatContainer.style.display = 'none';
  chatContainer.style.width = '350px';
  chatContainer.style.height = '500px';
  chatContainer.style.backgroundColor = 'white';
  chatContainer.style.borderRadius = '10px';
  chatContainer.style.boxShadow = '0 0 10px rgba(0,0,0,0.1)';
  chatContainer.style.marginBottom = '10px';
  container.insertBefore(chatContainer, toggleButton);

  // Toggle chat visibility
  toggleButton.onclick = () => {
    if (chatContainer.style.display === 'none') {
      chatContainer.style.display = 'block';
      toggleButton.innerHTML = 'Close';
      initializeChatbot();
    } else {
      chatContainer.style.display = 'none';
      toggleButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-robot" viewBox="0 0 16 16">
  <path d="M6 12.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5M3 8.062C3 6.76 4.235 5.765 5.53 5.886a26.6 26.6 0 0 0 4.94 0C11.765 5.765 13 6.76 13 8.062v1.157a.93.93 0 0 1-.765.935c-.845.147-2.34.346-4.235.346s-3.39-.2-4.235-.346A.93.93 0 0 1 3 9.219zm4.542-.827a.25.25 0 0 0-.217.068l-.92.9a25 25 0 0 1-1.871-.183.25.25 0 0 0-.068.495c.55.076 1.232.149 2.02.193a.25.25 0 0 0 .189-.071l.754-.736.847 1.71a.25.25 0 0 0 .404.062l.932-.97a25 25 0 0 0 1.922-.188.25.25 0 0 0-.068-.495c-.538.074-1.207.145-1.98.189a.25.25 0 0 0-.166.076l-.754.785-.842-1.7a.25.25 0 0 0-.182-.135"/>
  <path d="M8.5 1.866a1 1 0 1 0-1 0V3h-2A4.5 4.5 0 0 0 1 7.5V8a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1v1a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1v-.5A4.5 4.5 0 0 0 10.5 3h-2zM14 7.5V13a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7.5A3.5 3.5 0 0 1 5.5 4h5A3.5 3.5 0 0 1 14 7.5"/>
</svg>`; 
}
  };

  // Function to initialize chatbot
  async function initializeChatbot() {
    try {
      console.log('Fetching chatbot config...');
      const response = await fetch(`${baseUrl}/chatbot-config`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userid: aiId,
        }),
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Received data:', data);

      if (data.error) {
        throw new Error(data.error);
      }

      const {
        name = 'Assistant',
        color = '#0070f3',
        about = '',
        faqs = [],
        language = 'en',
      } = data;

      // Create chat interface
      chatContainer.innerHTML = `
        <div style="padding: 20px;">
          <div style="font-weight: bold; margin-bottom: 10px;">${name}</div>
          <div style="height: 400px; overflow-y: auto;" id="chat-messages"></div>
          <div style="display: flex; margin-top: 10px;">
            <input 
              type="text" 
              id="chat-input" 
              style="flex-grow: 1; padding: 8px; border: 1px solid #ddd; border-radius: 4px; margin-right: 8px;"
              placeholder="Type your message..."
            >
            <button 
              id="chat-send-button"
              style="padding: 8px 16px; background-color: ${color}; color: white; border: none; border-radius: 4px; cursor: pointer;">
              Send
            </button>
          </div>
        </div>
      `;

      const input = document.getElementById('chat-input');
      const sendButton = document.getElementById('chat-send-button');
      const messages = document.getElementById('chat-messages');

      // Handle enter key
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          sendMessage();
        }
      });

      // Handle send button click
      sendButton.addEventListener('click', sendMessage);

      async function sendMessage() {
        if (!input.value.trim()) return;

        const userMessage = input.value.trim();

        // Add user message
        messages.innerHTML += `
          <div style="margin-bottom: 10px; text-align: right;">
            <span style="background-color: #e3f2fd; padding: 8px; border-radius: 4px; display: inline-block;">
              ${userMessage}
            </span>
          </div>
        `;

        // Clear input
        input.value = '';

        // Add loading indicator
        const loadingDiv = document.createElement('div');
        loadingDiv.innerHTML = `
          <div style="margin-bottom: 10px; text-align: left;">
            <span style="background-color: #f5f5f5; padding: 8px; border-radius: 4px; display: inline-block;">
              Typing...
            </span>
          </div>
        `;
        messages.appendChild(loadingDiv);
        messages.scrollTop = messages.scrollHeight;

        try {
          const systemPrompt = `You are ${name} Chatbot, a friendly and knowledgeable assistant for ${name}.Remember to communicate strictly in ${language}. Your role is to represent the organization in a helpful, courteous, and professional manner, ensuring that users find value in each interaction.
  
      About the Organization
      ${about}

      Your Purpose
      As the company's virtual assistant, you should:

      Answer questions accurately and politely, using the FAQ and "About" information as your primary sources.
      Provide information with a friendly, helpful tone, always focusing on making the user experience pleasant and informative.
      If the user's question aligns with an FAQ, draw directly from the FAQ responses.
      For general or unfamiliar questions, use the "About" information as context to answer in a way that reflects the company's mission and values.

      FAQs
      ${JSON.stringify(faqs)}`;

          const response = await fetch(`${baseUrl}/api/chat`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              message: userMessage,
              systemPrompt: systemPrompt,
            }),
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          loadingDiv.remove();

          messages.innerHTML += `
            <div style="margin-bottom: 10px; text-align: left;">
              <span style="background-color: #f5f5f5; padding: 8px; border-radius: 4px; display: inline-block;">
                ${
                  data.response ||
                  'Sorry, I encountered an error. Please try again.'
                }
              </span>
            </div>
          `;
        } catch (error) {
          console.error('Chat error:', error);
          loadingDiv.remove();

          messages.innerHTML += `
            <div style="margin-bottom: 10px; text-align: left;">
              <span style="background-color: #ffebee; padding: 8px; border-radius: 4px; display: inline-block;">
                Sorry, I encountered an error. Please try again.
              </span>
            </div>
          `;
        }

        messages.scrollTop = messages.scrollHeight;
      }
    } catch (error) {
      console.error('Error loading chatbot:', error);
      chatContainer.innerHTML = `
        <div style="padding: 20px; color: red;">
          Error loading chatbot: ${error.message || 'Unknown error'}
        </div>
      `;
    }
  }
})();
