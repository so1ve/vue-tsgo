#!/usr/bin/env node
import { Cli, defineCommand } from "clerc";
import { join, resolve } from "pathe";
import { find } from "tsconfck";
import packageJson from "../../package.json";
import { createProject } from "../core/project";

const tsgo = defineCommand({
    name: "",
    flags: {
        project: {
            type: String,
        },
    },
}, async (context) => {
    let configPath = context.flags.project;
    if (configPath !== void 0) {
        configPath = resolve(configPath);
    }
    else {
        const fileName = join(process.cwd(), "dummy.ts");
        configPath = await find(fileName) ?? void 0;
    }

    if (configPath === void 0) {
        console.error("[Vue] Could not find a tsconfig.json file.");
        process.exit(1);
    }

    const project = await createProject(configPath);
    await project.runTsgo();
});

await Cli()
    .name("Vue Tsgo")
    .scriptName("vue-tsgo")
    .description(packageJson.description)
    .version(packageJson.version)
    .command(tsgo)
    .parse();
