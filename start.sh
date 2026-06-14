#!/usr/bin/env bash
set -e

echo "Starting Alexandria Unburnt Backend..."
echo ""

docker compose up -d --build

echo ""
echo "============================================"
echo "  Alexandria Unburnt Backend is running!"
echo "============================================"
echo ""
echo "  Backend  : http://localhost:8800"
echo "  MySQL    : localhost:3307"
echo ""
echo "============================================"
echo ""
echo "Logs: docker compose logs -f"
echo "Stop:  docker compose down"
