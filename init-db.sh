# !/bin/bash
cd $(dirname "$0")/neo4j
[ ! -d './conf' ] && mkdir conf
[ ! -d './plugins' ] && mkdir plugins
[ ! -d './data' ] && mkdir data

echo 'apoc.uuid.enabled=true\napoc.import.file.enabled=true\n' >  ./conf/apoc.conf
[ ! -f './plugins/apoc-4.2.0.0-all.jar' ] && curl -LJ https://github.com/neo4j-contrib/neo4j-apoc-procedures/releases/download/4.2.0.0/apoc-4.2.0.0-all.jar --output ./plugins/apoc-4.2.0.0-all.jar
docker-compose up -d
node ./migration.js
