if [[ $(rc-service docker status) == *"stopped"* ]]; then
    sudo rc-service docker start
    docker compose -f docker-compose.dev.yml up -d
fi

tmux neww $SHELL -c "pnpm run dev"
