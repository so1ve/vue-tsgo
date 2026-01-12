import { collectScriptRanges } from "./ranges/script";
import { collectScriptSetupRanges } from "./ranges/scriptSetup";
import type { IR } from "../parse/ir";

export interface CodegenResult {

}

export function generate(ir: IR): CodegenResult {
    const scriptRanges = ir.script && collectScriptRanges(ir.script);
    const scriptSetupRanges = ir.scriptSetup && collectScriptSetupRanges(ir.scriptSetup);

    return {};
}
