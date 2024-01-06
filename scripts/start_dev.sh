#!/usr/bin/env bash

# I use gentoo btw, I use tmux btw
if [[ $(rc-service docker status) == *"stopped"* ]]; then
    sudo rc-service docker start
    docker compose -f db.yml up -d
fi

tmux neww $SHELL -c "pnpm run dev"
