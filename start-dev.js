// start-dev.js
const { spawn } = require('child_process');
const path = require('path');

console.log('Starting Flight Management System in development mode...');

// Start backend server
const backend = spawn('mvn', ['spring-boot:run'], {
  cwd: path.join(__dirname, 'backend'),
  stdio: 'inherit'
});

// Start frontend server
const frontend = spawn('npm', ['run', 'dev'], {
  cwd: path.join(__dirname, 'frontend'),
  stdio: 'inherit'
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('Shutting down servers...');
  backend.kill();
  frontend.kill();
  process.exit(0);
});

backend.on('error', (error) => {
  console.error('Backend server error:', error);
});

frontend.on('error', (error) => {
  console.error('Frontend server error:', error);
});

console.log('Servers started successfully!');
console.log('Frontend: http://localhost:5173');
console.log('Backend: http://localhost:8080');
console.log('Press Ctrl+C to stop both servers');