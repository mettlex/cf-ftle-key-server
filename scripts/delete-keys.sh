#!/bin/bash

if [ -z "$1" ]; then
  echo "No argument supplied. Give namespace ID as an argument"
  exit
fi

wrangler kv:bulk delete --namespace-id=$1 keys.json