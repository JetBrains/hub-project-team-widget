#! /bin/bash

echo Publishing under $pluginsRepositoryLogin

curl -X POST -L -v --fail -F "userName=$pluginsRepositoryLogin" -F "pluginId=10467" -F "password=$pluginsRepositoryPassword" -F "file=@dist.zip;type=application/zip" https://plugins.jetbrains.com/plugin/uploadPlugin
