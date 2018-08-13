#! /bin/bash

zip -r dist.zip dist

curl -X POST -L \
   -F "password=$PLUGINS_PASSWORD" \
   -F "pluginId=10467" \
   -F "userName=$PLUGINS_USERNAME" \
   -F "file=@dist.zip;type=application/zip" \
   "https://plugins.jetbrains.com/plugin/uploadPlugin"
