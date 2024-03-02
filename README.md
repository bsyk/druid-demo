# druid-demo
Docker compose that sets up a nano Druid cluster and Atlas-Druid bridge

> Note, this is using the release image from Druid 29.0.0. This image already includes the
druid-spectator-histogram contrib-extension.
You must have Docker installed already.

## Build and Run the Demo
In the root of this demo repo:

```bash
docker compose up
```

This will fetch all required resources including the druid docker image and source and dependencies for the demo projects.
It will then build and start the Druid nano-quickstart single-instance server with the druid-spectator-histogram module loaded.
It will wait for the Druid container to start, then start the Atlas-Druid bridge container which can service queries presented in [Atlas Stack Language](https://netflix.github.io/atlas-docs/asl/tutorial/), translate into Druid queries and render charts of the results.

The Druid UI will be running and available at http://localhost:8888
A crude demo UI that uses the Atlas-Druid bridge to render charts for queries will be available at http://localhost:3000 as well as buttons to load sample datasets.
