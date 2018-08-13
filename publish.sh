#! /bin/bash

zip -r dist.zip dist

curl -X POST -L \
   -F "password=$pluginsRepositoryLogin" \
   -F "pluginId=10467" \
   -F "userName=$pluginsRepositoryPassword" \
   -F "file=@dist.zip;type=application/zip" \
   "https://plugins.jetbrains.com/plugin/uploadPlugin"
