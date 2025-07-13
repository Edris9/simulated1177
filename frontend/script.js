const API_BASE_URL = '/api';

// Global variabel för nuvarande användare
let currentUser = null;
let currentCallContext = null;

// Visa registreringsformulär
function showRegisterForm() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'block';
    document.querySelector('.container').style.display = 'flex';
    document.getElementById('dashboardWrapper').style.display = 'none';
    clearMessages();
}

// Visa inloggningsformulär
function showLoginForm() {
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('registerForm').style.display = 'none';
    document.querySelector('.container').style.display = 'flex';
    document.getElementById('dashboardWrapper').style.display = 'none';
    clearMessages();
}

// Visa dashboard med alla kontainrar
function showDashboard(userData) {
    currentUser = userData;
    document.querySelector('.container').style.display = 'none';
    document.getElementById('dashboardWrapper').style.display = 'block';
    
    // Uppdatera header med användarinfo
    const headerUserInfo = document.getElementById('headerUserInfo');
    headerUserInfo.innerHTML = `
        <p><strong>${userData.first_name} ${userData.last_name}</strong></p>
        <p><i class="fas fa-user"></i> ${userData.username} | <i class="fas fa-map-marker-alt"></i> ${userData.address} | <i class="fas fa-birthday-cake"></i> ${userData.age} år</p>
        ${userData.description ? `<p><i class="fas fa-info-circle"></i> ${userData.description}</p>` : ''}
    `;
    
    // Initiera kalender
    initializeCalendar();
    
    // Uppdatera status (simulerad data)
    updateStatusInfo();
}

// Initiera kalender
function initializeCalendar() {
    const now = new Date();
    const monthNames = [
        'Januari', 'Februari', 'Mars', 'April', 'Maj', 'Juni',
        'Juli', 'Augusti', 'September', 'Oktober', 'November', 'December'
    ];
    
    document.getElementById('currentMonth').textContent = 
        `${monthNames[now.getMonth()]} ${now.getFullYear()}`;
    
    // Generera kalenderdagar (förenklad version)
    const calendarGrid = document.getElementById('calendarGrid');
    calendarGrid.innerHTML = '';
    
    // Lägg till veckodagar
    const weekDays = ['Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör', 'Sön'];
    weekDays.forEach(day => {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day calendar-header';
        dayElement.textContent = day;
        calendarGrid.appendChild(dayElement);
    });
    
    // Lägg till dagar för denna månad (förenklad)
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).getDay();
    
    // Tomma celler för dagar före månadens start
    for (let i = 1; i < firstDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day empty';
        calendarGrid.appendChild(emptyDay);
    }
    
    // Lägg till alla dagar i månaden
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.textContent = day;
        
        // Markera dagens datum
        if (day === now.getDate()) {
            dayElement.classList.add('today');
        }
        
        // Simulera några bokade tider
        if (day === now.getDate() + 3 || day === now.getDate() + 7) {
            dayElement.classList.add('has-appointment');
            dayElement.title = 'Bokad tid';
        }
        
        calendarGrid.appendChild(dayElement);
    }
}

// Uppdatera status information
function updateStatusInfo() {
    const statusSummary = document.getElementById('statusSummary');
    const statusReason = document.getElementById('statusReason');
    
    // Simulerad data - i verkligheten skulle detta komma från backend
    statusSummary.innerHTML = `
        <p><strong>Senaste kontakt:</strong> Ingen registrerad</p>
        <p><strong>Status:</strong> Väntande på bedömning</p>
        <p><em>Ring AI-SSK för att få en bedömning av dina symptom.</em></p>
    `;
    
    statusReason.innerHTML = `
        <p><strong>Aktuell anledning:</strong> Ej angivet</p>
        <p><em>Beskriv dina symptom för AI-SSK för korrekt bedömning.</em></p>
    `;
}

// Ring AI-SSK funktionalitet
function callAISSK(context) {
    currentCallContext = context;
    document.getElementById('aiCallModal').style.display = 'flex';
    
    // Uppdatera modal beroende på kontext
    const callStatus = document.getElementById('callStatus');
    callStatus.textContent = 'Ansluter till AI-SSK...';
    
    // Simulera anslutning
    setTimeout(() => {
        callStatus.textContent = 'Ansluten! AI-SSK är redo att hjälpa dig.';
        setTimeout(() => {
            callStatus.textContent = 'AI-SSK: Hej! Jag kan hjälpa dig med symptombedömning och tidsbokning. Din förfrågan har registrerats och du kommer få en bekräftelse via e-post.';
            // Uppdatera status automatiskt
            updateStatusAfterCall();
        }, 2000);
    }, 3000);
}

// Uppdatera status efter AI-samtal
function updateStatusAfterCall() {
    const now = new Date().toLocaleString('sv-SE');
    
    const statusSummary = document.getElementById('statusSummary');
    const statusReason = document.getElementById('statusReason');
    
    statusSummary.innerHTML = `
        <p><strong>Senaste kontakt:</strong> ${now}</p>
        <p><strong>Status:</strong> Kontaktad AI-SSK</p>
        <p><strong>Åtgärd:</strong> Tidsbokning pågår</p>
    `;
    
    statusReason.innerHTML = `
        <p><strong>Typ av kontakt:</strong> ${currentCallContext === 'calendar' ? 'Tidsbokning' : 'Hälsobedömning'}</p>
        <p><strong>AI-bedömning:</strong> Läkarbesök rekommenderas</p>
        <p><strong>E-post:</strong> Bekräftelse skickas till din Gmail</p>
    `;
}

// Avsluta samtal
function endCall() {
    document.getElementById('aiCallModal').style.display = 'none';
    currentCallContext = null;
}

// Hantera Enter-tangent i chat
document.addEventListener('DOMContentLoaded', function() {
    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
});

// Visa felmeddelande
function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 5000);
}

// Visa framgångsmeddelande
function showSuccess(message) {
    const successDiv = document.getElementById('successMessage');
    successDiv.textContent = message;
    successDiv.style.display = 'block';
    setTimeout(() => {
        successDiv.style.display = 'none';
    }, 5000);
}

// Rensa meddelanden
function clearMessages() {
    document.getElementById('errorMessage').style.display = 'none';
    document.getElementById('successMessage').style.display = 'none';
}

// Hantera inloggning
document.getElementById('login').addEventListener('submit', async (e) => {
    e.preventDefault();
    clearMessages();
    
    const formData = {
        username: document.getElementById('loginUsername').value,
        password: document.getElementById('loginPassword').value
    };
    
    try {
        const response = await fetch(`${API_BASE_URL}/login/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
            credentials: 'include'
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showSuccess('Inloggning lyckades!');
            showDashboard(data.user);
            document.getElementById('login').reset();
        } else {
            showError(data.error || 'Inloggning misslyckades');
        }
    } catch (error) {
        showError('Ett fel uppstod. Försök igen senare.');
        console.error('Login error:', error);
    }
});

// Hantera registrering
document.getElementById('register').addEventListener('submit', async (e) => {
    e.preventDefault();
    clearMessages();
    
    const formData = {
        first_name: document.getElementById('firstName').value,
        last_name: document.getElementById('lastName').value,
        username: document.getElementById('regUsername').value,
        password: document.getElementById('regPassword').value,
        address: document.getElementById('address').value,
        age: parseInt(document.getElementById('age').value),
        description: document.getElementById('description').value
    };
    
    try {
        const response = await fetch(`${API_BASE_URL}/register/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showSuccess('Konto skapat framgångsrikt! Du kan nu logga in.');
            showLoginForm();
            document.getElementById('register').reset();
        } else {
            // Hantera valideringsfel
            if (data.username) {
                showError(data.username[0]);
            } else if (data.password) {
                showError(data.password[0]);
            } else if (data.age) {
                showError(data.age[0]);
            } else {
                showError('Registrering misslyckades. Kontrollera alla fält.');
            }
        }
    } catch (error) {
        showError('Ett fel uppstod. Försök igen senare.');
        console.error('Registration error:', error);
    }
});

// Hantera utloggning
async function logout() {
    try {
        const response = await fetch(`${API_BASE_URL}/logout/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        });
        
        if (response.ok) {
            showSuccess('Du har loggat ut');
            showLoginForm();
            endCall();
        } else {
            // Om POST inte fungerar, prova GET
            window.location.href = '/';
        }
    } catch (error) {
        showError('Ett fel uppstod vid utloggning');
        console.error('Logout error:', error);
        // Ladda om sidan som backup
        window.location.reload();
    }
}

// Kontrollera om användaren redan är inloggad vid sidladdning
window.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/profile/`, {
            credentials: 'include'
        });
        
        if (response.ok) {
            const userData = await response.json();
            showDashboard(userData);
        } else {
            showLoginForm();
        }
    } catch (error) {
        console.error('Profile check error:', error);
        showLoginForm();
    }
});