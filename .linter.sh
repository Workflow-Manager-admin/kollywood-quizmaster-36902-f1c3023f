#!/bin/bash
cd /home/kavia/workspace/code-generation/kollywood-quizmaster-36902-f1c3023f/kollywood_quizmaster
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

