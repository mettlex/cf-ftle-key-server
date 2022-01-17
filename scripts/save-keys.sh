#!/bin/bash

if [ -z "$1" ]; then
  echo "No argument supplied. Give namespace ID as an argument"
  exit
fi

wrangler kv:key list --namespace-id=$1 --prefix="0x" > keys.json
