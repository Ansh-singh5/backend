const API_BASE = 'http://localhost:3000';

let token = localStorage.getItem('token');
let user = JSON.parse(localStorage.getItem('user'));

const authSection = document.getElementById('authSection');
const todoSection = document.getElementById('todoSection');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const showLoginBtn = document.getElementById('showLoginBtn');
const showSignupBtn = document.getElementById('showSignupBtn');

function showSection(section) {
    if (section === 'login') {
        loginForm.style.display = 'block';
        signupForm.style.display = 'none';
        showLoginBtn.classList.add('active');
        showSignupBtn.classList.remove('active');
    } else if (section === 'signup') {
        loginForm.style.display = 'none';
        signupForm.style.display = 'block';
        showSignupBtn.classList.add('active');
        showLoginBtn.classList.remove('active');
    }
}

showLoginBtn.addEventListener('click', () => showSection('login'));
showSignupBtn.addEventListener('click', () => showSection('signup'));

function checkAuth() {
    if (token) {
        authSection.style.display = 'none';
        todoSection.style.display = 'block';
        document.getElementById('userNameDisplay').textContent = user.name;
        loadTodos();
    } else {
        authSection.style.display = 'block';
        todoSection.style.display = 'none';
    }
}

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch(`${API_BASE}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);
        
        token = data.token;
        user = data.user;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        loginForm.reset();
        checkAuth();
    } catch (err) {
        alert(err.message);
    }
});

signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;

    try {
        const response = await fetch(`${API_BASE}/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);
        
        alert('Signup successful! Please login.');
        showSection('login');
        signupForm.reset();
    } catch (err) {
        alert(err.message);
    }
});

document.getElementById('logoutBtn').addEventListener('click', () => {
    token = null;
    user = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    checkAuth();
});

// Todo Functions
async function loadTodos() {
    try {
        const response = await fetch(`${API_BASE}/todos`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (!response.ok) {
            if (response.status === 401) {
                document.getElementById('logoutBtn').click();
            }
            throw new Error(data.message);
        }
        displayTodos(data);
    } catch (err) {
        console.error(err);
    }
}

document.getElementById('todoForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value;

    try {
        const response = await fetch(`${API_BASE}/todos`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ title })
        });
        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || 'Failed to add todo');
        }
        document.getElementById('todoForm').reset();
        loadTodos();
    } catch (err) {
        alert(err.message);
    }
});

async function toggleComplete(id, isComplete) {
    try {
        const response = await fetch(`${API_BASE}/todos/${id}`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ isComplete })
        });
        if (!response.ok) throw new Error('Failed to update todo');
        loadTodos();
    } catch (err) {
        alert(err.message);
    }
}

async function removeTodo(id) {
    try {
        const response = await fetch(`${API_BASE}/todos/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to delete todo');
        loadTodos();
    } catch (err) {
        alert(err.message);
    }
}

function displayTodos(todos) {
    const todosList = document.getElementById('todosList');
    todosList.innerHTML = '';
    
    todos.forEach(todo => {
        const todoDiv = document.createElement('div');
        todoDiv.className = `todo-item ${todo.isComplete ? 'completed' : ''}`;
        
        const titleSpan = document.createElement('span');
        titleSpan.textContent = todo.title;
        
        const actionsDiv = document.createElement('div');
        
        const completeBtn = document.createElement('button');
        completeBtn.textContent = todo.isComplete ? 'Undo' : 'Complete';
        completeBtn.onclick = () => toggleComplete(todo._id, !todo.isComplete);
        
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.onclick = () => removeTodo(todo._id);
        
        actionsDiv.appendChild(completeBtn);
        actionsDiv.appendChild(deleteBtn);
        
        todoDiv.appendChild(titleSpan);
        todoDiv.appendChild(actionsDiv);
        todosList.appendChild(todoDiv);
    });
}

// Initial load
checkAuth();