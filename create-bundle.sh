#!/usr/bin/env bash

rm -rf ./bundle/
yarn run build
cp ./README.md ./bundle/
cp ./package.json ./bundle/