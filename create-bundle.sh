#!/usr/bin/env bash

rm -rf ./bundle/
npm run build
cp ./README.md ./bundle/
cp ./package.json ./bundle/