#! /bin/bash

curl -X POST -L -v --fail -H "Authorization: Bearer $pluginsRepositoryToken" -F "pluginId=10467" -F "file=@dist.zip;type=application/zip" https://plugins.jetbrains.com/plugin/uploadPlugin
