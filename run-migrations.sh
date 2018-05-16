#!/bin/sh

yarn build
node_modules/.bin/sequelize db:migrate && node_modules/.bin/sequelize db:seed:all
echo "DB migrations applied"
