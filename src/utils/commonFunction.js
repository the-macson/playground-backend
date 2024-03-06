const Docker = require('dockerode');
const docker = new Docker();

exports.runContainerIfNotRunning = async (containerName) => {
  try {
    const containers = await docker.listContainers({ all: true });
    const container = containers.find((container) =>
      container.Names.includes(`/${containerName}`),
    );
    if (container && container.State === 'running') {
      console.log('Container already running');
      return true;
    }
    if (container && container.State === 'exited') {
      const stoppedContainer = docker.getContainer(container.Id);
      await stoppedContainer.start();
      console.log('Container started successfully');
      return true;
    }
    return false;
  } catch (error) {
    console.log(error);
  }
};

exports.createCompilerContainer = async (containerConfig) => {
  try {
    const container = await docker.createContainer(containerConfig);
    await container.start();
    console.log('Container created and started successfully');
    container.attach(
      { stream: true, stdout: true, stderr: true },
      (err, stream) => {
        if (err) {
          console.log(err);
        }
        stream.on('data', (data) => {
          console.log(data.toString());
        });
      },
    );
    return true;
  } catch (error) {
    throw new Error(error);
  }
};
