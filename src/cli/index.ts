#!/usr/bin/env node
import { Clerc, defineCommand, helpPlugin, versionPlugin } from "clerc";
import { sync as resolveSync } from "oxc-resolver";
import { join, resolve } from "pathe";
import { find } from "tsconfck";
import packageJson from "../../package.json";
import { createProject } from "../core/project";
import { runTsgoCommand } from "../core/shared";

const tsgo = defineCommand({
    name: "",
    description: packageJson.description,
    flags: {
        project: {
            type: String,
            short: "p",
            description: "Path to tsconfig.json file",
        },
        pretty: {
            type: Boolean,
            help: {
                show: false,
            },
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
    await project.runTsgo(context.rawParsed.rawUnknown);
});

await Clerc.create()
    .use(helpPlugin({
        command: false,
        footer: async () => {
            console.log();
            console.log("-".repeat(40));
            console.log();

            await runTsgoCommand(
                resolveSync,
                process.cwd(),
                ["--help"],
                {
                    nodeOptions: {
                        // use the same stdio as the current process
                        // to ensure the help text is well formatted in the terminal
                        stdio: "inherit",
                    },
                },
            );

            // fake it - the `footer` getter expects a string, but we have already printed the help text directly to the terminal, so we just return an empty string here.
            return "";
        },
    }))
    .use(versionPlugin())
    .name("Vue Tsgo")
    .scriptName("vue-tsgo")
    .description(packageJson.description)
    .version(packageJson.version)
    .command(tsgo)
    .parse();
