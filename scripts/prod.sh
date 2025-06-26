#!/bin/bash
echo "Starting production environment..."
docker-compose -f infrastructure/docker-compose.prod.yml up --build 