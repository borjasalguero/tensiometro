module.exports = {
  // Login related errors. They will follow 1XY
  user_not_authenticated: {
    code: 101,
    message: 'Error: User not logged in.'
  },
  username_already_used: {
    code: 102,
    message: 'Error: Username already exist.'
  },
  // Logout related errors. They will follow 2XY
  logout_error: {
    code: 201,
    message: 'Error: Unable to log out your account.'
  },
  // Register
  register_params: {
    code: 301,
    message: 'Error: Username/Password are not defined properly'
  }
};