let host = 'http://localhost:8081';

// Check if running inside a Docker container
if (require('fs').existsSync('/proc/1/cgroup')) {
  // Update the host for Docker environment
  host = 'http://backend:8081'; // Use your Docker service name
}

module.exports = {
  host,
};