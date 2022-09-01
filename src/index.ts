import * as core from "@actions/core";
import * as exec from "@actions/exec";
import * as fs from "fs";
import * as plist from "plist";

process.on("unhandledRejection", handleError);
main().catch(handleError);

async function main(): Promise<void> {
    try {
        let printFile = getBooleanInput("print-file");
        let infoPlistPath = core.getInput("expo-plist-path");

        if (!fs.existsSync(infoPlistPath)) {
            core.setFailed(
                `The file path for the Expo.plist does not exist or is not found: ${infoPlistPath}`
            );
            process.exit(1);
        }

        core.debug(`Running task with ${infoPlistPath}`);

        let updatesReleaseChannel: string = core.getInput(
            "updates-release-channel"
        );

        if (!updatesReleaseChannel) {
            core.setFailed(
                `Updates Release Channel has no value: ${updatesReleaseChannel}. You must define it.`
            );
            process.exit(1);
        }

        let runtimeVersion: string = core.getInput("updates-runtime-version");

        if (printFile) {
            core.info("Before update:");
            await exec.exec("cat", [infoPlistPath]);
        }

        let fileContent = fs.readFileSync(infoPlistPath, { encoding: "utf8" });
        core.debug(JSON.stringify(fileContent));

        let obj = plist.parse(fileContent);
        obj["EXUpdatesReleaseChannel"] = updatesReleaseChannel;
        if (runtimeVersion) {
            obj["EXUpdatesRuntimeVersion"] = runtimeVersion;
        }

        fs.chmodSync(infoPlistPath, "600");
        fs.writeFileSync(infoPlistPath, plist.build(obj));

        if (printFile) {
            core.info("After update:");
            await exec.exec("cat", [infoPlistPath]);
        }

        core.info(
            `Expo.plist updated successfully with EXUpdatesReleaseChannel: ${updatesReleaseChannel}
            EXUpdatesRuntimeVersion: ${runtimeVersion}`
        );
    } catch (error: any) {
        core.setFailed(error.message);
    }
}

function handleError(err: any): void {
    console.error(err);
    core.setFailed(`Unhandled error: ${err}`);
}

function getBooleanInput(
    inputName: string,
    defaultValue: boolean = false
): boolean {
    return (
        (core.getInput(inputName) || String(defaultValue)).toUpperCase() ===
        "TRUE"
    );
}
