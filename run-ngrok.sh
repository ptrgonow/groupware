#!/bin/bash
nohup ngrok http --domain=impala-intent-rarely.ngrok-free.app $1 > ngrok.log 2>&1 &

