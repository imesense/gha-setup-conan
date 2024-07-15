import * as core from "@actions/core";
import * as github from "@actions/github";
import * as io from "@actions/io";
import * as os from "os";
import * as fs from "fs";
import * as request from "request";
import * as compressing from "compressing";

function getPlatform()
{
    const platform = os.platform();
    switch (platform)
    {
        case "win32":
            return "windows";
        case "linux":
            return "linux";
        case "darwin":
            return "macos";
        default:
            throw new Error(`Not supported platform!`);
    }
}

function getArchitecture()
{
    const architecture = os.arch();
    switch (architecture)
    {
        case "ia32":
            return "i686";
        case "x64":
            return "x86_64";
        case "arm64":
            return "arm64";
        default:
            throw new Error(`Not supported architecture!`);
    }
}

async function downloadAsBuffer(url)
{
    return new Promise((resolve, reject) =>
    {
        console.log(`Downloading file ${url}`);
        request.get({ url, encoding: null }, (error, responce, body) =>
        {
            if (error)
            {
                reject(error);
                return;
            }

            if (responce.statusCode >= 400)
            {
                reject(new Error(`Recieved ${responce.statusCode} from ${url}`));
            }
            else
            {
                console.log(`Download complete`);
                resolve(body);
            }
        });
    });
}

async function run()
{
    try
    {
        const version = core.getInput("version");
        console.debug(`version: ${version}`);

        let release = version;
        if (version === "latest")
        {
            const url = "https://github.com/conan-io/conan/releases/latest";
            request({ url: url, followRedirect: false }, (error, response, body) =>
            {
                if (!error && response.statusCode === 302)
                {
                    const strings = response.headers.location.split('/');
                    release = strings[strings.length - 1];
                    console.log(`Version: ${release}`);
                }
                else if (error)
                {
                    console.error(`Error: ${error}`);
                }
                else
                {
                    console.log(`Status code: ${response.statusCode}`);
                }
            });
        }

        const platform = getPlatform().toString();
        const architecture = getArchitecture().toString();
        const format =
            os.platform() === "win32"
                ? "zip"
                : "tgz";
        const url = `https://github.com/conan-io/conan/releases/download/${release}/conan-${release}-${platform}-${architecture}.${format}`;
        console.debug(`platform: ${platform}`);
        console.debug(`architecture: ${architecture}`);
        console.debug(`url: ${url}`);

        const destionation = "bin";
        await io.mkdirP(destionation);

        const buffer = await downloadAsBuffer(url);
        if (format === "zip")
        {
            await compressing.zip.uncompress(buffer, destionation);
        }
        else if (format === "tgz")
        {
            await compressing.tgz.uncompress(buffer, destionation);
        }

        fs.chmodSync(destionation, "755");
        console.log(`Successfully installed Conan ${release}`);

        core.addPath(destionation);
        console.log(`Successfully added Conan to PATH`);

        const payload = JSON.stringify(github.context.payload, undefined, 2);
        console.debug(`Event payload: ${payload}`);
    }
    catch (error)
    {
        core.setFailed(error.message);
    }
}

run();
