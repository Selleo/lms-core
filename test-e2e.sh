#!/bin/bash

echo "Starting infrastructure services..."
docker compose -f docker-compose.test.yml up -d

echo "Waiting for services to be healthy..."
while ! docker compose -f docker-compose.test.yml ps | grep healthy > /dev/null; do
  echo "Waiting for services to start..."
  sleep 5
done

cd apps/web
echo "Installing dependencies..."
pnpm install

echo "Running tests..."
pnpm playwright test

TEST_EXIT_CODE=$?

echo "Cleaning up..."
cd ../..
docker compose -f docker-compose.test.yml down

exit $TEST_EXIT_CODE
