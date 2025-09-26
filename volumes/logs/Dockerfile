FROM timberio/vector:nightly-2025-09-24-debian

USER root

RUN apt update && \
  apt install -y --no-install-recommends curl && \
  apt clean && \
  rm -rf /var/lib/apt/list* # Clean up to reduce image size
