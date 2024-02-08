# druid-demo
Docker compose that sets up a nano Druid cluster and Atlas-Druid bridge

> Note, this is using a pre-release image from Druid 29.0.0-snapshot that must already
have been build and available to your docker host. This image must include the contrib-extensions
in order to be able to load the demo druid-spectator-histogram module.

To build the base Druid docker image, first check out my forked repo then follow the instructions below.

Instructions are taken from the [official readme](https://github.com/apache/druid/blob/master/distribution/docker/README.md)
Except, we want to ensure that extensions-contrib are included. The instructions miss this if building on Apple M1/M2 so are copied/updated here.

> Make sure to be on the `spectator-histogram` branch before proceeding below

### Build Base Druid Image on non-Apple hardware

From the root of the forked repo, run following command. This will build from source within the container, including extensions-contrib.

```bash
DOCKER_BUILDKIT=1 docker build -t apache/druid:29.0.0-snapshot -f distribution/docker/Dockerfile .
```

### Building images on Apple M1/M2
To build images on Apple M1/M2, you need to follow the instructions in this section.

1. build Druid distribution from the root of the forked repo, including extensions-contrib.
   ```bash
   mvn clean package \
      -Pdist,bundle-contrib-exts \
      -Pskip-static-checks,skip-tests \
      -Dmaven.javadoc.skip=true
   ```
2. build target image
   ```
   DOCKER_BUILDKIT=1 docker build -t apache/druid:29.0.0-snapshot -f distribution/docker/Dockerfile --build-arg BUILD_FROM_SOURCE=false .
   ```

## Build and Run the Demo
Once you have the Druid 29.0.0-snapshot image built, you can build and run the demo containers.

In the root of this demo repo:

```bash
docker compose up
```

This will build and start the Druid nano-quickstart single-instance server with the druid-spectator-histogram module loaded.
It will wait for the Druid container to start, then start the Atlas-Druid bridge container which can service queries presented in [Atlas Stack Language](https://netflix.github.io/atlas-docs/asl/tutorial/), translate into Druid queries and render charts of the results.

The Druid UI will be running and available at http://localhost:8888
A crude demo UI that calls Atlas-Druid bridge to render charts for queries will be available at http://localhost:3000
