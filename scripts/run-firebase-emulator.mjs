#!/usr/bin/env node
import { execFileSync, spawn, spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';

function parseJavaMajorVersion(output) {
  const match = output.match(/version "(\d+)(?:\.(\d+))?/);

  if (!match) {
    return undefined;
  }

  const major = Number(match[1]);

  if (major === 1 && match[2]) {
    return Number(match[2]);
  }

  return major;
}

function getJavaMajorVersion(javaHome) {
  const result = spawnSync(path.join(javaHome, 'bin', 'java'), ['-version'], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  const output = `${result.stdout ?? ''}${result.stderr ?? ''}`;
  return parseJavaMajorVersion(output);
}

function isJava21OrNewer(javaHome) {
  const majorVersion = getJavaMajorVersion(javaHome);
  return typeof majorVersion === 'number' && majorVersion >= 21;
}

function resolveJavaHomeFromPath() {
  const versionResult = spawnSync('java', ['-version'], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  if (versionResult.error) {
    return undefined;
  }

  const versionOutput = `${versionResult.stdout ?? ''}${versionResult.stderr ?? ''}`;
  const majorVersion = parseJavaMajorVersion(versionOutput);

  if (typeof majorVersion !== 'number' || majorVersion < 21) {
    return undefined;
  }

  const settingsResult = spawnSync('java', ['-XshowSettings:properties', '-version'], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  if (settingsResult.error) {
    return undefined;
  }

  const settingsOutput = `${settingsResult.stdout ?? ''}${settingsResult.stderr ?? ''}`;
  const homeMatch = settingsOutput.match(/^\s*java\.home\s*=\s*(.+)$/m);

  if (!homeMatch) {
    return undefined;
  }

  const javaHome = homeMatch[1].trim();

  if (javaHome.length === 0) {
    return undefined;
  }

  if (isJava21OrNewer(javaHome)) {
    return javaHome;
  }

  return undefined;
}

function resolveJavaHome() {
  if (process.env.JAVA_HOME && process.env.JAVA_HOME.length > 0) {
    if (isJava21OrNewer(process.env.JAVA_HOME)) {
      return process.env.JAVA_HOME;
    }
  }

  const pathJavaHome = resolveJavaHomeFromPath();
  if (pathJavaHome) {
    return pathJavaHome;
  }

  if (process.platform === 'darwin') {
    try {
      const resolved = execFileSync('/usr/libexec/java_home', ['-v', '21'], {
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'pipe'],
      }).trim();

      if (resolved.length > 0 && isJava21OrNewer(resolved)) {
        return resolved;
      }
    } catch {
      // Fall through to common Homebrew locations.
    }
  }

  const brewCandidates = [
    '/usr/local/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home',
    '/opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home',
  ];

  for (const candidate of brewCandidates) {
    if (existsSync(candidate) && isJava21OrNewer(candidate)) {
      return candidate;
    }
  }

  return undefined;
}

const javaHome = resolveJavaHome();

if (!javaHome) {
  console.error('Unable to find JDK 21. Install Java 21, then set JAVA_HOME or make `java` (21+) available in PATH.');
  process.exit(1);
}

const env = {
  ...process.env,
  JAVA_HOME: javaHome,
  PATH: `${path.join(javaHome, 'bin')}${path.delimiter}${process.env.PATH ?? ''}`,
};

const child = spawn('firebase', ['emulators:start', ...process.argv.slice(2)], {
  env,
  stdio: 'inherit',
});

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 1);
});

child.on('error', (error) => {
  console.error(error.message);
  process.exit(1);
});
