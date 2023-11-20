#!/bin/bash
set -e

host="$1"
port="$2"
shift 2
cmd="$@"

# Wait for the database to be ready
while ! echo > /dev/tcp/"$host"/"$port"; do
  >&2 echo "Waiting for $host:$port..."
  sleep 1
done

>&2 echo "$host:$port is up - executing command"
exec $cmd