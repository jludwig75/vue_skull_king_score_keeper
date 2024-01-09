# Use the docker-rust_dev image as the base
FROM docker-vue_dev:latest

ARG USERNAME

# Set the entry point to bash
# ENTRYPOINT ["/bin/bash"]
# ENTRYPOINT ["sleep", "infinity"]

RUN cd /home/${USERNAME}/workspace && \
    sudo npm install --save-dev jest

# Expose the necessary ports if needed (8000 as an example)
EXPOSE 8080
