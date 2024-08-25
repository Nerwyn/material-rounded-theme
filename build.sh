#!/bin/sh

echo Building theme...
python ./githooks/pre-commit.py
echo Done!

sftp -P 22 $SSH_HOST <<EOF
put ./themes/material_rounded.yaml $THEME_PATH
EOF
