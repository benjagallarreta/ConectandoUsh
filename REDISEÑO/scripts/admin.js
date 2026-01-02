// ========================================
// ADMIN.JS - Panel de administración
// ========================================

let db, auth;
let unsubscribe;

document.addEventListener('DOMContentLoaded', () => {
    window.firebaseDB.init();
    db = window.firebaseDB.getDB();
    auth = firebase.auth();
    
    // Check if already logged in
    auth.onAuthStateChanged((user) => {
        if (user) {
            showAdminPanel();
            loadAdminQuestions();
        } else {
            showLogin();
        }
    });
    
    // Login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
});

async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('admin-email').value;
    const password = document.getElementById('admin-password').value;
    
    try {
        await auth.signInWithEmailAndPassword(email, password);
        showNotification('Login exitoso', 'success');
    } catch (error) {
        console.error('Error login:', error);
        showNotification('Credenciales incorrectas', 'error');
    }
}

async function handleLogout() {
    try {
        await auth.signOut();
        showLogin();
        showNotification('Sesión cerrada', 'success');
    } catch (error) {
        console.error('Error logout:', error);
    }
}

function showLogin() {
    document.getElementById('admin-login').style.display = 'block';
    document.getElementById('admin-panel').style.display = 'none';
}

function showAdminPanel() {
    document.getElementById('admin-login').style.display = 'none';
    document.getElementById('admin-panel').style.display = 'block';
}

function loadAdminQuestions() {
    unsubscribe = db.collection('questions')
        .orderBy('date', 'desc')
        .onSnapshot((snapshot) => {
            const questions = [];
            snapshot.forEach((doc) => {
                questions.push({ id: doc.id, ...doc.data() });
            });
            renderAdminQuestions(questions);
        });
}

function renderAdminQuestions(questions) {
    const list = document.getElementById('admin-questions-list');
    if (!list) return;
    
    list.innerHTML = questions.map(q => `
        <div class="admin-question-card">
            <div class="admin-q-header">
                <strong>${escapeHtml(q.user)}</strong>
                <span class="admin-date">${q.date?.toDate ? formatDate(q.date.toDate()) : ''}</span>
            </div>
            <p class="admin-q-text">${escapeHtml(q.question)}</p>
            
            ${q.answer ? `
                <div class="admin-answer-box">
                    <strong>Tu respuesta:</strong>
                    <p>${escapeHtml(q.answer)}</p>
                </div>
            ` : `
                <form class="admin-answer-form" onsubmit="handleAnswer(event, '${q.id}')">
                    <textarea placeholder="Escribe tu respuesta..." required></textarea>
                    <button type="submit" class="btn btn-primary">Responder</button>
                </form>
            `}
            
            <button onclick="deleteQuestion('${q.id}')" class="btn-delete">Eliminar</button>
        </div>
    `).join('');
}

async function handleAnswer(e, questionId) {
    e.preventDefault();
    const textarea = e.target.querySelector('textarea');
    const answer = textarea.value.trim();
    
    if (!answer) return;
    
    try {
        await db.collection('questions').doc(questionId).update({
            answer: answer,
            answeredBy: 'ConectandoUsh',
            answeredAt: firebase.firestore.Timestamp.now()
        });
        showNotification('Respuesta publicada', 'success');
    } catch (error) {
        console.error('Error:', error);
        showNotification('Error al responder', 'error');
    }
}

async function deleteQuestion(questionId) {
    if (!confirm('¿Seguro que quieres eliminar esta pregunta?')) return;
    
    try {
        await db.collection('questions').doc(questionId).delete();
        showNotification('Pregunta eliminada', 'success');
    } catch (error) {
        console.error('Error:', error);
        showNotification('Error al eliminar', 'error');
    }
}

function formatDate(date) {
    return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.classList.add('show'), 100);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

window.handleAnswer = handleAnswer;
window.deleteQuestion = deleteQuestion;