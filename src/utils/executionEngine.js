const Docker = require('dockerode');
const docker = new Docker();
const {
  runContainerIfNotRunning,
  createCompilerContainer,
  pullImage,
} = require('./commonFunction');

const LANGUAGE_CONFIGS = {
  cpp: {
    image: 'ubuntu:latest',
    containerName: 'cpp-container',
    setupCmd: 'apt-get update && apt-get install -y g++ && tail -f /dev/null',
    compileCmd: (codeFile, outFile) => `g++ ${codeFile} -o ${outFile}`,
    runCmd: (outFile, inputFile) => `${outFile} < ${inputFile}`,
    extension: 'cpp',
    executable: 'code.out',
  },
  python: {
    image: 'python:3.9-slim',
    containerName: 'playground-python',
    setupCmd: 'tail -f /dev/null',
    compileCmd: null,
    runCmd: (codeFile, inputFile) => `python3 ${codeFile} < ${inputFile}`,
    extension: 'py',
  },
  javascript: {
    image: 'node:18-slim',
    containerName: 'playground-node',
    setupCmd: 'tail -f /dev/null',
    compileCmd: null,
    runCmd: (codeFile, inputFile) => `node ${codeFile} < ${inputFile}`,
    extension: 'js',
  },
};

const setupContainer = async (lang) => {
  const config = LANGUAGE_CONFIGS[lang];
  if (!config) throw new Error(`Unsupported language: ${lang}`);

  try {
    const isRunning = await runContainerIfNotRunning(config.containerName);
    if (isRunning) return true;

    const images = await docker.listImages({
      filters: { reference: [config.image] },
    });

    if (images.length === 0) {
      await pullImage(config.image);
    }

    const containerConfig = {
      Image: config.image,
      Cmd: ['bin/bash', '-c', config.setupCmd],
      Tty: true,
      name: config.containerName,
      AttachStdout: true,
      AttachStderr: true,
    };

    return await createCompilerContainer(containerConfig);
  } catch (error) {
    console.error(`Error setting up container for ${lang}:`, error);
    return false;
  }
};

const runCode = async (lang, code, testCases) => {
  const config = LANGUAGE_CONFIGS[lang];
  if (!config) throw new Error(`Unsupported language: ${lang}`);

  const container = docker.getContainer(config.containerName);
  const workDir = `/tmp/submission_${Date.now()}`;
  const codeFile = `${workDir}/solution.${config.extension}`;
  const outFile = config.executable ? `${workDir}/${config.executable}` : null;

  try {
    const setupExec = await container.exec({
      Cmd: [
        'bash',
        '-c',
        `mkdir -p ${workDir} && echo "$1" > ${codeFile}`,
        '-',
        code,
      ],
      AttachStdout: true,
      AttachStderr: true,
    });
    await new Promise(async (resolve, reject) => {
      const setupStream = await setupExec.start();
      setupStream.on('data', (data) => {
        console.log('Data', data.toString());
      });
      setupStream.on('end', () => {
        console.log('Code written successfully');
        resolve();
      });
      setupStream.on('error', (err) => {
        console.log('Error writing code', err);
        reject(err);
      });
    });

    if (config.compileCmd) {
      const compileCmd = config.compileCmd(codeFile, outFile);
      const compileExec = await container.exec({
        Cmd: ['bash', '-c', compileCmd],
        AttachStdout: true,
        AttachStderr: true,
      });
      let compileError = '';
      await new Promise(async (resolve, reject) => {
        const timeout = setTimeout(
          () => reject(new Error('Compilation timed out')),
          30000,
        );
        const compileStream = await compileExec.start();
        compileStream.on('data', (data) => {
          compileError += data.toString();
        });
        compileStream.on('end', () => {
          console.log('Compilation done');
          clearTimeout(timeout);
          resolve();
        });
        compileStream.on('error', (err) => {
          console.log('Compilation error', err);
          clearTimeout(timeout);
          reject(err);
        });
      });

      if (compileError.trim()) {
        throw new Error(`Compilation Error: ${compileError}`);
      }
    }

    const executionPromises = testCases.map(async (testCase, index) => {
      const inputFile = `${workDir}/input_${index}.txt`;

      const encodedInput = Buffer.from(testCase.input).toString('base64');
      const inputExec = await container.exec({
        Cmd: [
          'bash',
          '-c',
          `echo '${encodedInput}' | base64 -d > ${inputFile}`,
        ],
        AttachStdout: true,
        AttachStderr: true,
      });
      await new Promise(async (resolve, reject) => {
        const timeout = setTimeout(
          () => reject(new Error('Input write timed out')),
          10000,
        );
        const inputStream = await inputExec.start();
        inputStream.on('data', (data) => {
          console.log('Input data', data.toString());
        });
        inputStream.on('end', () => {
          clearTimeout(timeout);
          resolve();
        });
        inputStream.on('error', (err) => {
          clearTimeout(timeout);
          reject(err);
        });
      });

      const runCmd = config.runCmd(
        config.compileCmd ? outFile : codeFile,
        inputFile,
      );
      return new Promise(async (resolve, reject) => {
        const exec = await container.exec({
          Cmd: [
            'bash',
            '-c',
            `chmod +x ${outFile || codeFile} && timeout 2s ${runCmd}`,
          ],
          AttachStdout: true,
          AttachStderr: true,
        });

        const stream = await exec.start();
        let result = '';

        stream.on('data', (data) => {
          result += data.toString().replace(/[^ -~\n\r\t]/g, '');
        });

        stream.on('end', () => {
          const passed = result.trim() === testCase.output.trim();
          resolve(passed);
        });

        stream.on('error', (err) => {
          reject(err);
        });
      });
    });

    const results = await Promise.all(executionPromises);
    const passedTestCases = results.filter(Boolean).length;

    await container
      .exec({ Cmd: ['rm', '-rf', workDir] })
      .then((e) => e.start());

    return passedTestCases;
  } catch (error) {
    console.log('Error running code', error);
    throw error;
  }
};

const initAllContainers = async () => {
  const results = {};
  for (const [lang, config] of Object.entries(LANGUAGE_CONFIGS)) {
    try {
      const ready = await setupContainer(lang);
      results[lang] = ready;
    } catch (error) {
      results[lang] = false;
    }
  }
  return results;
};

module.exports = { setupContainer, runCode, initAllContainers };
