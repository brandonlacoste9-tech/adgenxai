module.exports = {
  apps: [
    {
      name: 'github-pr-manager',
      script: 'dist/index.js',
      cwd: __dirname,
      interpreter: process.execPath,
      env: {
        PORT: process.env.PORT || 3001,
        NODE_ENV: process.env.NODE_ENV || 'production'
      },
      kill_timeout: 3000,
      restart_delay: 1000,
      max_restarts: 5
    }
  ]
};
