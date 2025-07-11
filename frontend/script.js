const API_BASE_URL = '/api';

// Visa registreringsformulär
function showRegisterForm() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'block';
    document.getElementById('myPages').style.display = 'none';
    clearMessages();
}

// Visa inloggningsformulär
function showLoginForm() {
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('registerForm').style.display = 'none';
    document.getElementById('myPages').style.display = 'none';
    clearMessages();
}

// Visa mina sidor
function showMyPages(userData) {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'none';
    document.getElementById('myPages').style.display = 'block';
    
    // Visa användarinformation
    const userInfo = document.getElementById('userInfo');
    userInfo.innerHTML = `
        <h3>Välkommen ${userData.first_name} ${userData.last_name}!</h3>
        <p><strong>Användarnamn:</strong> ${userData.username}</p>
        <p><strong>Adress:</strong> ${userData.address}</p>
        <p><strong>Ålder:</strong> ${userData.age} år</p>
        ${userData.description ? `<p><strong>Om mig:</strong> ${userData.description}</p>` : ''}
    `;
}

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
            showMyPages(data.user);
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
            showMyPages(userData);
        } else {
            showLoginForm();
        }
    } catch (error) {
        console.error('Profile check error:', error);
        showLoginForm();
    }
});


function logout() {
    window.location.href = '/';  // Bara ladda om sidan
}