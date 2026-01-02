// ========================================
// COMMUNITY.JS - Sistema de preguntas con Firebase
// ========================================

let communityDB;
let unsubscribe;

document.addEventListener('DOMContentLoaded', () => {
    const firebaseInitialized = window.firebaseDB.init();
    
    if (!firebaseInitialized) {
        console.error('No se pudo inicializar Firebase');
        showError('No se pudo conectar con el servidor. Por favor, recarga la página.');
        return;
    }
    
    communityDB = window.firebaseDB.getDB();
    loadQuestionsRealtime();
    
    const form = document.getElementById('question-form');
    if (form) {
        form.addEventListener('submit', handleSubmit);
    }
});

function loadQuestionsRealtime() {
    const questionsList = document.getElementById('questions-list');
    if (!questionsList) return;
    
    questionsList.innerHTML = '<div class="loading">Cargando preguntas...</div>';
    
    unsubscribe = communityDB.collection('questions')
        .orderBy('date', 'desc')
        .onSnapshot((snapshot) => {
            const questions = [];
            snapshot.forEach((doc) => {
                questions.push({ id: doc.id, ...doc.data() });
            });
            renderQuestions(questions);
        }, (error) => {
            console.error('Error al cargar preguntas:', error);
            showError('Error al cargar las preguntas. Por favor, recarga la página.');
        });
}

async function handleSubmit(e) {
    e.preventDefault();
    
    const submitButton = e.target.querySelector('button[type="submit"]');
    const userName = document.getElementById('user-name').value.trim();
    const userQuestion = document.getElementById('user-question').value.trim();
    
    if (!userName || !userQuestion) {
        showNotification('Por favor completa todos los campos', 'error');
        return;
    }
    
    submitButton.disabled = true;
    submitButton.innerHTML = '<svg class="spinner" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line></svg> Enviando...';
    
    try {
        await communityDB.collection('questions').add({
            user: userName,
            question: userQuestion,
            date: firebase.firestore.Timestamp.now(),
            likes: 0,
            answer: null,
            createdAt: new Date().toISOString()
        });
        
        document.getElementById('user-name').value = '';
        document.getElementById('user-question').value = '';
        showNotification('¡Pregunta enviada con éxito!', 'success');
        
    } catch (error) {
        console.error('Error al enviar pregunta:', error);
        showNotification('Error al enviar la pregunta. Por favor, intenta de nuevo.', 'error');
    } finally {
        submitButton.disabled = false;
        submitButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg> Enviar Pregunta';
    }
}

async function handleLike(questionId) {
    try {
        const questionRef = communityDB.collection('questions').doc(questionId);
        const doc = await questionRef.get();
        
        if (doc.exists) {
            const currentLikes = doc.data().likes || 0;
            await questionRef.update({ likes: currentLikes + 1 });
            showNotification('¡Like agregado!', 'success');
        }
    } catch (error) {
        console.error('Error al dar like:', error);
        showNotification('Error al dar like. Intenta de nuevo.', 'error');
    }
}

function renderQuestions(questions) {
    const questionsList = document.getElementById('questions-list');
    if (!questionsList) return;
    
    if (questions.length === 0) {
        questionsList.innerHTML = '<div class="no-questions"><p>🤔 Aún no hay preguntas. ¡Sé el primero en preguntar!</p></div>';
        return;
    }
    
    questionsList.innerHTML = questions.map(q => {
        let dateStr = 'Hace un momento';
        if (q.date && q.date.toDate) {
            dateStr = formatDate(q.date.toDate());
        }
        
        return `
            <div class="question-card">
                <div class="question-header">
                    <div class="question-user">
                        <div class="user-avatar">${escapeHtml(q.user.charAt(0).toUpperCase())}</div>
                        <div class="user-info">
                            <div class="user-name">${escapeHtml(q.user)}</div>
                            <div class="question-date">${dateStr}</div>
                        </div>
                    </div>
                    <button class="like-button" onclick="handleLike('${q.id}')">
                        <span>👍</span>
                        <span>${q.likes || 0}</span>
                    </button>
                </div>
                <p class="question-text">${escapeHtml(q.question)}</p>
                ${q.answer ? `
                    <div class="question-answer official-answer">
                        <div class="answer-header">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                            <span class="official-badge">Respuesta Oficial - ConectandoUsh</span>
                        </div>
                        <p class="answer-text">${escapeHtml(q.answer)}</p>
                    </div>
                ` : ''}
            </div>
        `;
    }).join('');
}

function formatDate(date) {
    return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showNotification(message, type = 'info') {
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

function showError(message) {
    const questionsList = document.getElementById('questions-list');
    if (questionsList) {
        questionsList.innerHTML = `<div class="error-message"><p>❌ ${message}</p></div>`;
    }
}

window.handleLike = handleLike;
window.addEventListener('beforeunload', () => { if (unsubscribe) unsubscribe(); });