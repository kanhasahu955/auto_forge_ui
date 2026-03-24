// PM2 config for bare-metal deployment (when NOT using Docker)
// Each app runs on its own port; use nginx to route /interview-agent → port 3001
const path = require('path')

module.exports = {
  apps: [
    {
      name: 'AutoForge',
      script: '.output/server/index.mjs',
      cwd: path.join(__dirname, 'apps/AutoForge'),
      instances: 'max',
      exec_mode: 'cluster',
      env: { NODE_ENV: 'production', PORT: 3000 },
      error_file: 'logs/autoforge-error.log',
      out_file: 'logs/autoforge-out.log',
    },
    {
      name: 'interview-agent',
      script: '.output/server/index.mjs',
      cwd: path.join(__dirname, 'apps/interview-agent'),
      instances: 'max',
      exec_mode: 'cluster',
      env: { NODE_ENV: 'production', PORT: 3001 },
      error_file: 'logs/interview-agent-error.log',
      out_file: 'logs/interview-agent-out.log',
    },
    {
      name: 'auth-mfe',
      script: '.output/server/index.mjs',
      cwd: path.join(__dirname, 'apps/auth-mfe'),
      instances: 1,
      exec_mode: 'fork',
      env: { NODE_ENV: 'production', PORT: 3002 },
      error_file: 'logs/auth-mfe-error.log',
      out_file: 'logs/auth-mfe-out.log',
    },
    {
      name: 'org-mfe',
      script: '.output/server/index.mjs',
      cwd: path.join(__dirname, 'apps/org-mfe'),
      instances: 1,
      exec_mode: 'fork',
      env: { NODE_ENV: 'production', PORT: 3003 },
      error_file: 'logs/org-mfe-error.log',
      out_file: 'logs/org-mfe-out.log',
    },
  ],
}
