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
  return new Promise(async (resolve, reject) => {
    try {
      let passedTestCases = 0;
      const container = cppDocker.getContainer(containerName);
      new Promise(async (resolve, reject) => {
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
        execStart.on('data', (data) => {
          if (data.toString().replace(/[^ -~]/g, '') === '') {
            console.log('Code compiled');
            resolve('Code compiled');
          } else {
            reject(data.toString().replace(/[^ -~]/g, ''));
          }
        });
        execStart.on('end', () => {
          resolve('Code compiled');
        });
      })
        .then(() => {
          console.log('Code compiled');
          let writeInputPrmises = testCases.map(
            async ({ input, output }, index) => {
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
              return new Promise(async (resolve, reject) => {
                const execStart = await execCode.start();
                resolve('Input written');
              }).catch((err) => {
                console.log(err);
                reject(err);
              });
            },
          );
          Promise.all(writeInputPrmises)
            .then(() => {
              let execs = testCases.map(async ({ input, output }, index) => {
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
                return new Promise((resolve, reject) => {
                  let result = '';
                  let timeoutId;
                  const timeoutPromise = new Promise((resolve, reject) => {
                    timeoutId = setTimeout(async () => {
                      console.log('Killing process');
                      const killProcess = await container.exec({
                        Cmd: ['bash', '-c', 'kill -9 $(pidof code)'],
                        AttachStdout: true,
                        AttachStderr: true,
                      });
                      await killProcess.start();
                      reject('Time Limit Exceed');
                    }, 3000); // 4 seconds
                  });
                  execStart.on('data', (data) => {
                    result += data.toString().replace(/[^ -~]/g, '');
                  });
                  execStart.on('end', () => {
                    clearTimeout(timeoutId);
                    if (result == output) {
                      passedTestCases++;
                    }
                    console.log(result);
                    resolve('Test case run');
                  });
                  execStart.on('error', (err) => {
                    clearTimeout(timeoutId);
                    reject(err);
                  });
                  Promise.race([
                    timeoutPromise,
                    new Promise((resolve) => execStart.on('end', resolve)),
                  ])
                    .then(() => {
                      resolve('Test case run');
                    })
                    .catch((err) => {
                      reject(err);
                    });
                });
              });
              Promise.all(execs)
                .then(() => {
                  console.log(passedTestCases);
                  console.log('All test cases run');
                  resolve(passedTestCases);
                })
                .catch((err) => {
                  console.log(err);
                  reject(err);
                });
            })
            .catch((err) => {
              console.log(err);
              reject(err);
            });
        })
        .catch((err) => {
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
