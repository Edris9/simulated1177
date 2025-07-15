
        function startChat() {
            document.getElementById('mainButtons').style.display = 'none';
            document.getElementById('chatContainer').style.display = 'block';
            document.getElementById('callContainer').style.display = 'none';
        }

        function startCall() {
            document.getElementById('mainButtons').style.display = 'none';
            document.getElementById('chatContainer').style.display = 'none';
            document.getElementById('callContainer').style.display = 'block';
        }

        function endChat() {
            document.getElementById('mainButtons').style.display = 'flex';
            document.getElementById('chatContainer').style.display = 'none';
            document.getElementById('callContainer').style.display = 'none';
        }

        function endCall() {
            document.getElementById('mainButtons').style.display = 'flex';
            document.getElementById('chatContainer').style.display = 'none';
            document.getElementById('callContainer').style.display = 'none';
        }

        function sendMessage() {
            const input = document.getElementById('chatInput');
            const messages = document.getElementById('chatMessages');
            
            if (input.value.trim()) {
                // Lägg till användarens meddelande
                const userMessage = document.createElement('div');
                userMessage.className = 'message';
                userMessage.innerHTML = `<strong>Du:</strong> ${input.value}`;
                messages.appendChild(userMessage);
                
                // Lägg till AI-svar
                setTimeout(() => {
                    const aiMessage = document.createElement('div');
                    aiMessage.className = 'message';
                    aiMessage.innerHTML = `<strong>AI-SSK:</strong> Utveckling är på gång...`;
                    messages.appendChild(aiMessage);
                    messages.scrollTop = messages.scrollHeight;
                }, 1000);
                
                input.value = '';
                messages.scrollTop = messages.scrollHeight;
            }
        }

        // Enter-tangent för att skicka meddelande
        document.getElementById('chatInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });