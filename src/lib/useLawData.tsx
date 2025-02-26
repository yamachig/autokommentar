import React, { useMemo } from "react";
import createClient from "openapi-fetch";
import type { paths } from "../lawApiV2Schema";
import loadEL from "lawtext/dist/src/node/el/loadEL";
import type { JsonEL } from "lawtext/dist/src/node/el/jsonEL";
import type { Analysis } from "lawtext/dist/src/analyzer";
import { analyze } from "lawtext/dist/src/analyzer";
import type * as std from "lawtext/dist/src/law/std";
import { locate as locatePath } from "lawtext/dist/src/path/v1/locate";
import { parse as parsePath } from "lawtext/dist/src/path/v1/parse";
import type { Container } from "lawtext/dist/src/node/container";
import type { ____Declaration } from "lawtext/dist/src/node/el/controls";
import { ____Pointer } from "lawtext/dist/src/node/el/controls";
import { ____VarRef } from "lawtext/dist/src/node/el/controls";
import { EL } from "lawtext/dist/src/node/el";
import type { PointerEnv } from "lawtext/dist/src/node/pointerEnv";
import { getPointerEnvTarget, type PointerEnvTarget } from "./RefView";
import type { PathFragment } from "lawtext/dist/src/path/v1/common";

const client = createClient<paths>({ baseUrl: "https://laws.e-gov.go.jp/api/2/" });

export interface BaseLawData {
    jsonEL: JsonEL,
    law: std.Law,
    analysis: Analysis,
}

export const useBaseLawData = (lawSpecifier: string) => {
    const [baseLawData, setBaseLawData] = React.useState<BaseLawData | null>(null);

    React.useEffect(() => {
        (async () => {
            const response = await client.GET(
                "/law_data/{law_id_or_num_or_revision_id}",
                {
                    params: {
                        path: {
                            law_id_or_num_or_revision_id: lawSpecifier,
                        },
                    },
                },
            );
            if (!response.data) throw new Error("Failed to fetch law data");
            const jsonEL = response.data?.law_full_text as unknown as JsonEL;
            const law = loadEL(jsonEL) as std.Law;
            const analysis = await analyze({ elToBeModified: law });

            setBaseLawData({ jsonEL, law, analysis });
        })();
    }, [lawSpecifier]);

    return { baseLawData };
};

export interface RefData {
    varRefs: ____VarRef[];
    referencedDeclarations: ____Declaration[];
    pointerEnvs: PointerEnv[];
    index: (
        | { type: "declaration", declarationID: string }
        | { type: "pointerTarget", target: PointerEnvTarget, targetString: string }
    )[],
}

export interface SelectedContainerData {
    container: Container;
    refData: RefData,
}

export interface LawData {
    jsonEL: JsonEL;
    law: std.Law;
    analysis: Analysis;
    parsedPath: {
        lawSpecifier: string;
        path: PathFragment[];
    },
    selectedContainerData: SelectedContainerData | null;
}

const gatherRefData = (el: EL, refData: RefData, analysis: Analysis) => {
    if (el instanceof ____VarRef) {
        refData.varRefs.push(el);
        const declaration = analysis.declarations.get(el.attr.declarationID);
        if (!refData.referencedDeclarations.includes(declaration)) {
            refData.referencedDeclarations.push(declaration);
            refData.index.push({ type: "declaration", declarationID: declaration.attr.declarationID });
        }
    } else if (el instanceof ____Pointer) {
        const pointerEnv = analysis.pointerEnvByEL.get(el);
        if (pointerEnv?.located) {
            refData.pointerEnvs.push(pointerEnv);
            const pointerEnvTarget = getPointerEnvTarget(pointerEnv);
            const targetString = JSON.stringify(pointerEnvTarget);
            if (pointerEnvTarget && !refData.index.some((index) => index.type === "pointerTarget" && index.targetString === targetString)) {
                refData.index.push({ type: "pointerTarget", target: pointerEnvTarget, targetString });
            }
        }
    }
    for (const child of el.children) {
        if (child instanceof EL) gatherRefData(child, refData, analysis);
    }
};

export const useLawData = (path: string) => {

    const parsedPath = useMemo(() => {
        const parts = (path || "405AC0000000088/a=39").split("/", 2);
        if (parts[1]) {
            const parsedPath = parsePath(parts[1] ?? "");
            if (parsedPath.ok) {
                return {
                    lawSpecifier: parts[0] ?? "",
                    path: parsedPath.value,
                };
            } else {
                throw new Error("Invalid path");
            }
        } else {
            return {
                lawSpecifier: parts[0] ?? "",
                path: [],
            };
        }
    }, [path]);

    const lawSpecifier = parsedPath.lawSpecifier;
    const { baseLawData } = useBaseLawData(lawSpecifier);

    const lawData = useMemo<LawData | null>(() => {
        if (!baseLawData) {
            return null;
        }
        const { jsonEL, law, analysis } = baseLawData;

        let selectedContainerData: SelectedContainerData | null = null;

        if (parsedPath.path.length > 0) {
            const located = locatePath(analysis.rootContainer, parsedPath.path, []);
            if (located.ok) {
                const container = located.value.container;

                const refData: RefData = {
                    varRefs: [],
                    referencedDeclarations: [],
                    pointerEnvs: [],
                    index: [],
                };
                gatherRefData(container.el, refData, analysis);

                selectedContainerData = { container, refData };
            }
        }

        return { jsonEL, law, analysis, parsedPath, selectedContainerData };
    }, [baseLawData, parsedPath]);

    return { lawData };
};

export default useLawData;
