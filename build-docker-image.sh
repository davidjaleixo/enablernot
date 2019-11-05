#!/bin/bash

version="$1"

docker build -t vfos/nenabler:${version:-latest} .
