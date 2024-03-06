const Docker = require('dockerode');
const cppDocker = new Docker();
const {
  runContainerIfNotRunning,
  createCompilerContainer,
} = require('./commonFunction');
const containerName = 'cpp-container';
const containerConfig = {
  Image: 'ubuntu:latest',
  Cmd: [
    'bin/bash',
    '-c',
    'apt-get update && apt-get install -y g++ && tail -f /dev/null',
  ],
  Tty: true,
  name: containerName,
  AttachStdout: true,
  AttachStderr: true,
};

const runCppCodeParallel = async (code, testCases) => {
  return new Promise(async(resolve, reject) => {
    try {
      let passedTestCases = 0;
      const container = cppDocker.getContainer(containerName);
      const exec = await container.exec({
        Cmd: [
          'bash',
          '-c',
          'mkdir -p /tmp && echo "$1" > /tmp/code.cpp && g++ /tmp/code.cpp -o /tmp/code',
          '-',
          code,
        ],
        AttachStdout: true,
        AttachStderr: true,
      });
      const execStart = await exec.start();
      console.log('Compilation started');

      let writeInputPrmises = testCases.map(async({ input, output }, index) => {
        const execCode = await container.exec({
          Cmd: [
            'bash',
            '-c',
            `echo "$1" > /tmp/input${index}.txt`,
            '-',
            input,
          ],
          AttachStdout: true,
          AttachStderr: true,
        });
        return new Promise(async(resolve, reject) => {
          const execStart = await execCode.start();
          resolve('Input written');
        }).catch((err) => {
          console.log(err);
          reject(err);
        });
      });
      Promise.all(writeInputPrmises).then(() => {
        console.log('All inputs written');
      }).then(() => {
        let execs = testCases.map(async({ input, output }, index) => {
          let execId = '';
          const execCode = await container.exec({
            Cmd: [
              'bash',
              '-c',
              `chmod +x /tmp/code && /tmp/code < /tmp/input${index}.txt`,
            ],
            AttachStdout: true,
            AttachStderr: true,
          });
          const execStart = await execCode.start();
          execId = execStart.id;
          return new Promise((resolve, reject) => {
            let result = '';
            execStart.on('data', (data) => {
              result += data.toString().replace(/[^ -~]/g, '');
            });
            execStart.on('end', () => {
              if (result == output) {
                passedTestCases++;
              }
              console.log(result);
              resolve('Test case run');
            });
            execStart.on('error', (err) => {
              reject(err);
            });
          });
        });
        Promise.all(execs).then(() => {
          console.log(passedTestCases);
          console.log('All test cases run');
          resolve(passedTestCases);
        }).catch((err) => {
          console.log(err);
          reject(err);
        });
      }).catch((err) => {
        console.log(err);
        reject(err);
      });
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

const upAndRunCppCompiler = async () => {
  try {
    const isRunning = await runContainerIfNotRunning(containerName);
    if (isRunning) {
      return true;
    }
    const isCreated = await createCompilerContainer(containerConfig);
    if (isCreated) {
      return true;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};

module.exports = { upAndRunCppCompiler, runCppCodeParallel };
