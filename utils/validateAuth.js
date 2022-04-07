const USERNAME_MINLENGTH = 3;
const USERNAME_MAXLENGTH = 30;
const PASSWORD_MINLENGTH = 6;
const PASSWORD_MAXLENGTH = 60;

function validateAuth(body, session) {
  const { username, password } = body;
  if (session.loggedIn) {
    throw new Error(`Already signed in as ${session.username}`);
  }
  if (username.length < 3) {
    throw new Error(`Username has to be at least ${USERNAME_MINLENGTH} characters long`);
  }
  if (username.length > 30 ) {
    throw new Error(`Username cannot be longer than ${USERNAME_MAXLENGTH} characters`)
  }
  if (username.match(/\W+/)) {
    throw new Error(`Username can only contain 0-9, A-Z and _`)
  }
  if (password.length < 6) {
    throw new Error(`Password has to be at least ${PASSWORD_MINLENGTH} characters long`);
  }
  if (password.length > 60) {
    throw new Error(`Password cannot be longer than ${PASSWORD_MAXLENGTH} characters`);
  }
  if (password === username) {
    throw new Error(`Password can not be the same as username`);
  }
}

module.exports = validateAuth;
