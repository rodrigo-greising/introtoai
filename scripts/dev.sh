#!/bin/bash
echo "🚀 Starting IntroToAI development server with watch mode..."
echo "📁 Watching for file changes in src/, package.json, and config files"
echo "🔄 Automatic syncing and rebuilding enabled"
echo ""
docker-compose -f infrastructure/docker-compose.yml up --watch --build 