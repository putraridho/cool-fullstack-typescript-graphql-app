#!/bin/bash

echo What should the version be?
read VERSION

docker build -t putraridho/liredis:$VERSION .
docker push putraridho/liredis:$VERSION