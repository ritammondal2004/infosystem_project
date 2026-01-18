#!/bin/sh

if [ "$NODE_ENV" = "production" ]; then
  echo "Starting in PRODUCTION mode..."
  npm run build
  npm start
else
  echo "Starting in DEVELOPMENT mode..."
  npm run dev
fi
