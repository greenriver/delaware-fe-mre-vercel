FROM node:18-bullseye
ARG USER_ID
ARG GROUP_ID

COPY docker/Aptfile /tmp/Aptfile
RUN apt-get update -qq && DEBIAN_FRONTEND=noninteractive apt-get -yq dist-upgrade && \
  DEBIAN_FRONTEND=noninteractive apt-get install -yq --no-install-recommends \
    build-essential \
    $(cat /tmp/Aptfile | xargs) && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* && \
    truncate -s 0 /var/log/*log && \
    groupadd -g ${GROUP_ID:-10000} -r app-user && \
    useradd -m -r -u ${USER_ID:-10000} -g app-user app-user

COPY docker/entrypoint.sh /usr/bin/
RUN chmod +x /usr/bin/entrypoint.sh
ENTRYPOINT ["/usr/bin/entrypoint.sh"]

RUN mkdir -p /app && chown app-user:app-user /app

WORKDIR /app

USER app-user
