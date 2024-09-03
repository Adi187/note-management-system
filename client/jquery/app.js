$(document).ready(function() {
    // Set up the main layout
    $('body').append(`
        <div id="title-container" style="background-color: #222; border-radius: 10px; padding: 20px;">
            <h1 class="text-center mt-4" style="color: white;">Notes Management System</h1>
        </div>
        <div id="content-container"></div>
    `);

    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const username = localStorage.getItem('username');

    if (isLoggedIn === 'true' && username) {
        // Show notes page if logged in
        showNotesPage(username);
    } else {
        // Show login form if not logged in
        showLoginForm();
    }

    function showLoginForm() {
        $('#content-container').empty().append(`
            <div class="centered-form">
                <form id="login-form">
                    <h2 class="text-center">Login</h2>
                    <div class="form-group">
                        <input type="text" class="form-control" id="username" placeholder="Username" required>
                    </div>
                    <div class="form-group">
                        <input type="password" class="form-control" id="password" placeholder="Password" required>
                    </div>
                    <button type="submit" class="btn btn-primary btn-block">Login</button>
                </form>
                <p class="text-center mt-3"><button type="button" id="register-button" class="btn btn-link">Register</button></p>
            </div>
        `);

        // Handle login form submission
        $('#login-form').on('submit', function(event) {
            event.preventDefault();
            const username = $('#username').val();
            const password = $('#password').val();
            loginUser(username, password);
        });

        // Handle registration button click
        $('#register-button').on('click', function() {
            showRegistrationForm();
        });
    }

    function showRegistrationForm() {
        $('#content-container').empty().append(`
            <div class="centered-form">
                <form id="registration-form">
                    <h2 class="text-center">Register</h2>
                    <div class="form-group">
                        <input type="text" class="form-control" id="reg-username" placeholder="Username" required>
                    </div>
                    <div class="form-group">
                        <input type="password" class="form-control" id="reg-password" placeholder="Password" required>
                    </div>
                    <button type="submit" class="btn btn-primary btn-block">Register</button>
                    <p class="text-center mt-3"><button type="button" id="login-button" class="btn btn-link">Login</button></p>
                </form>
            </div>
        `);

        // Handle registration form submission
        $('#registration-form').on('submit', function(event) {
            event.preventDefault();
            const username = $('#reg-username').val();
            const password = $('#reg-password').val();
            registerUser(username, password);
        });

        // Handle login button click
        $('#login-button').on('click', function() {
            showLoginForm();
        });
    }

    function loginUser(username, password) {
        $.ajax({
            url: '/auth/login',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ username, password }),
            success: function(response) {
                // Store login state in localStorage
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('username', username);

                alert('Login successful!');
                showNotesPage(username);
            },
            error: function() {
                alert('Login failed. Please try again.');
            }
        });
    }

    function showNotesPage(username) {
        $('#content-container').empty().append(`
            <div class="container mt-5">
                <h2 class="text-center">Welcome, <span id="username">${username}</span></h2>
                <div class="centered-form">
                    <form id="note-form">
                        <div class="form-group">
                            <input type="text" class="form-control" id="note-title" placeholder="Note Title" required>
                        </div>
                        <div class="form-group">
                            <textarea class="form-control" id="note-content" placeholder="Note Content" required></textarea>
                        </div>
                        <button type="submit" class="btn btn-primary btn-block">Add Note</button>
                    </form>
                </div>
                <div class="text-center mt-3">
                    <button id="logout-button" class="btn btn-danger">Logout</button>
                </div>
                <h2 class="text-center mt-5">Your Notes</h2>
                <div id="notes-container" class="notes-container row"></div>
            </div>
        `);

        // Handle note form submission
        $('#note-form').on('submit', function(event) {
            event.preventDefault();
            const title = $('#note-title').val();
            const content = $('#note-content').val();
            createNote(title, content);
        });

        // Handle logout button click
        $('#logout-button').on('click', function() {
            logoutUser();
            showLoginForm();
        });

        fetchNotes();  // Load notes on page load
    }

    function createNote(title, content) {
        $.ajax({
            url: '/notes/create',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ title, content }),
            success: function() {
                alert('Note added successfully!');
                fetchNotes();  // Refresh notes list
            },
            error: function() {
                alert('Failed to add note.');
            }
        });
    }

    function fetchNotes() {
        $.ajax({
            url: '/notes/display',
            method: 'GET',
            success: function(response) {
                const notesContainer = $('#notes-container');
                notesContainer.empty();
                response.forEach(note => {
                    notesContainer.append(`
                        <div class="col-md-4 mb-4">
                            <div class="card h-100">
                                <div class="card-body">
                                    <h3 class="card-title">${note.title}</h3>
                                    <p class="card-text">${note.content}</p>
                                </div>
                            </div>
                        </div>
                    `);
                });
            },
            error: function() {
                alert('Failed to fetch notes.');
            }
        });
    }

    function logoutUser() {
        $.ajax({
            url: '/auth/logout',
            method: 'POST',
            success: function() {
                // Clear login state from localStorage
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('username');

                alert('Logged out successfully!');
            },
            error: function() {
                alert('Failed to logout.');
            }
        });
    }
});
