FROM node
MAINTAINER Shahriyar Imanov <shehi@imanov.me>

WORKDIR /home/comeon

ENV DEBIAN_FRONTEND noninteractive
ENV NPM_CONFIG_LOGLEVEL warn

# Install dependencies
RUN apt-get update -y \
    && apt-get install -y apt-utils \
    && apt-get upgrade -y \
    && apt-get install -y \
        bzip2 \
        nano \
        telnet \
        unzip \
        wget

# Port for node --inspect
EXPOSE 9229

# Clean-up
RUN apt-get clean \
    && apt-get autoremove -y \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*
