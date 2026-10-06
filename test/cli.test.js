import { test } from "node:test";
import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { readFileSync } from "node:fs";

const execFileAsync = promisify(execFile);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const cliPath = join(__dirname, "../bin/mailtric.js");
const pkg = JSON.parse(
    readFileSync(join(__dirname, "../package.json"), "utf8"),
);

// Helper to strip ANSI codes for straightforward text assertions
function stripAnsi(str) {
    return str.replace(/\x1B\[[0-9;]*[a-zA-Z]/g, "");
}

test("mailtric runs default greeting", async () => {
    const { stdout } = await execFileAsync("node", [cliPath]);
    const clean = stripAnsi(stdout);
    assert.match(clean, /Hello, World! Welcome to Mailtric\./);
    assert.match(clean, /mailtric --help/);
});

test("mailtric hello <name>", async () => {
    const { stdout } = await execFileAsync("node", [
        cliPath,
        "hello",
        "Developer",
    ]);
    const clean = stripAnsi(stdout);
    assert.match(clean, /Hello, Developer! Welcome to Mailtric\./);
});

test("mailtric --version and -v", async () => {
    const { stdout: stdoutLong } = await execFileAsync("node", [
        cliPath,
        "--version",
    ]);
    assert.equal(stdoutLong.trim(), pkg.version);

    const { stdout: stdoutShort } = await execFileAsync("node", [
        cliPath,
        "-v",
    ]);
    assert.equal(stdoutShort.trim(), pkg.version);
});

test("mailtric --help and -h", async () => {
    const { stdout } = await execFileAsync("node", [cliPath, "--help"]);
    const clean = stripAnsi(stdout);
    assert.match(clean, /Usage:/);
    assert.match(clean, /mailtric \[command\] \[options\]/);
});

test("mailtric unknown command exits with code 1", async () => {
    await assert.rejects(
        async () => {
            await execFileAsync("node", [cliPath, "nonexistent-cmd"]);
        },
        (err) => {
            assert.equal(err.code, 1);
            const clean = stripAnsi(err.stderr);
            assert.match(clean, /Unknown command "nonexistent-cmd"/);
            return true;
        },
    );
});
