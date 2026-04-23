FROM ubuntu:latest

ENV USER=ubuntu

# System essentials
RUN apt-get update && apt-get upgrade -y \
&& apt-get install -y --no-install-recommends \
sudo \
curl \
unzip \
ca-certificates \
git \
openssh-client \
vim \
jq \
bash-completion \
&& apt-get clean && rm -rf /var/lib/apt/lists/*

# Docker
RUN apt-get update && apt-get install -y --no-install-recommends docker.io docker-compose-v2 \
    && apt-get clean && rm -rf /var/lib/apt/lists/* \
    && usermod -aG docker ubuntu

# GitHub CLI
RUN install -m 0755 -d /etc/apt/keyrings \
    && curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg -o /etc/apt/keyrings/githubcli-archive-keyring.gpg \
    && chmod go+r /etc/apt/keyrings/githubcli-archive-keyring.gpg \
    && echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" > /etc/apt/sources.list.d/github-cli.list \
    && apt-get update && apt-get install -y --no-install-recommends gh \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Node.js (for Playwright MCP and tooling that needs npx)
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y --no-install-recommends nodejs \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Playwright Chromium deps (headless browser for MCP vision/screenshots)
RUN npx playwright install --with-deps chromium

# Allow ubuntu user to run commands as root
RUN echo "${USER} ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers

# Switch to ubuntu user for all installs
USER ${USER}
WORKDIR /home/${USER}

# Claude Code CLI
RUN curl -fsSL https://claude.ai/install.sh | bash
ENV PATH="/home/${USER}/.local/bin:${PATH}"

# Makes git trust any mounted workspace directory
RUN git config --global --add safe.directory '*'
