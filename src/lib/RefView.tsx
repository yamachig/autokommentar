import React from "react";
import type { HTMLComponentProps } from "lawtext/dist/src/renderer/common/html";
import type { LawData, RefData } from "./useLawData";
import ContainersView, { getContainerTitle } from "./ContainersView";
import CommentLawWrapper from "./CommentLawWrapper";
import type { ElawsPartialLawViewProps } from "./ElawsPartialLawView";
import ElawsPartialLawView from "./ElawsPartialLawView";
import { ____PF } from "lawtext/dist/src/node/el/controls";
import styled from "styled-components";
import type { PointerEnv } from "lawtext/dist/src/node/pointerEnv";

export interface RefViewProps { index: RefData["index"][number], indexNumber: number }

export type PointerEnvTarget =(
    | {
        type: "external",
        props: ElawsPartialLawViewProps,
    }
    | {
        type: "internal",
        containerIDs: string[];
    }
);

const RefViewDiv = styled.div<{indexnumber: number}>`
    &.highlight {
        background-color: rgba(255, 238, 0, 0.235);
    }
    transition: background-color 0.3s;
    body[data-ref_data_index="${(props) => props.indexnumber}"] & {
        background-color: rgba(255, 238, 0, 0.235);
    }
`;

export const getPointerEnvTarget = (pointerEnv: PointerEnv): PointerEnvTarget | null => {
    if (!pointerEnv.located) return null;
    if (pointerEnv.located.type === "external") {
        const lawNum = pointerEnv.located.lawRef.attr.lawNum;
        let article: string|undefined = undefined;
        let paragraph: string|undefined = undefined;
        let appdxTable: string|undefined = undefined;
        let startsWithNotSupported = false;
        for (const prefix of pointerEnv.located.fqPrefixFragments.slice(0, pointerEnv.located.fqPrefixFragments.length - pointerEnv.located.skipSameCount)) {
            if (!["Law", "Article", "Paragraph", "AppdxTable"].includes(prefix.attr.targetType)) {
                startsWithNotSupported = true;
            }
            article = (
                (!startsWithNotSupported && prefix.attr.targetType === "Article") ? prefix.attr.name : undefined
            ) ?? article;
            paragraph = (
                (!startsWithNotSupported && prefix.attr.targetType === "Paragraph") ? prefix.attr.name : undefined
            ) ?? paragraph;
            appdxTable = (
                (!startsWithNotSupported && prefix.attr.targetType === "APPDX") ? prefix.attr.name : undefined
            ) ?? appdxTable;
        }
        const pfIndex = -1;
        for (const child of pointerEnv.pointer.children) {
            if (child instanceof ____PF) {
                const prefixOrChild = (
                    (pfIndex < pointerEnv.located.skipSameCount)
                        ? pointerEnv.located.fqPrefixFragments.find(f => f.attr.targetType === child.attr.targetType) ?? child
                        : child
                );

                if (!["Law", "Article", "Paragraph", "AppdxTable"].includes(prefixOrChild.attr.targetType)) {
                    startsWithNotSupported = true;
                }

                article = (
                    (!startsWithNotSupported && prefixOrChild.attr.targetType === "Article") ? prefixOrChild.attr.name : undefined
                ) ?? article;
                paragraph = (
                    (!startsWithNotSupported && prefixOrChild.attr.targetType === "Paragraph") ? prefixOrChild.attr.name : undefined
                ) ?? paragraph;
                appdxTable = (
                    (!startsWithNotSupported && prefixOrChild.attr.targetType === "APPDX") ? prefixOrChild.attr.name : undefined
                ) ?? appdxTable;
            }
        }
        if (article || paragraph || appdxTable) {
            const elawsPartialLawViewProps: ElawsPartialLawViewProps = {
                lawTitle: pointerEnv.located.lawRef.attr.suggestedLawTitle,
                lawNum,
                article,
                paragraph,
                appdxTable,
            };
            return {
                type: "external",
                props: elawsPartialLawViewProps,
            };
        }

    } else {
        const lastFragment = pointerEnv.located.fragments[pointerEnv.located.fragments.length - 1]!;
        const containerIDs = lastFragment.containers.map((c) => c.containerID) || null;
        return {
            type: "internal",
            containerIDs,
        };
    }
    return null;
};

export const RefView = (props: HTMLComponentProps & RefViewProps) => {
    const { htmlOptions } = props;
    const options = htmlOptions.options as { lawData: LawData };
    const { lawData } = options;
    const { index, indexNumber } = props;

    const refViewOnMouseEnter: React.MouseEventHandler<HTMLDivElement> = React.useCallback(e => {
        const indexNumber = e.currentTarget.dataset.ref_data_index;
        globalThis.window.document.body.dataset.ref_data_index = indexNumber;
    }, []);

    const refViewOnMouseLeave: React.MouseEventHandler<HTMLDivElement> = React.useCallback(e => {
        const indexNumber = e.currentTarget.dataset.ref_data_index;
        if (globalThis.window.document.body.dataset.ref_data_index === indexNumber) {
            delete globalThis.window.document.body.dataset.ref_data_index;
        }
    }, []);

    if (!lawData.selectedContainerData) return null;

    const params = {
        title: "",
        element: null as React.ReactElement | null,
    };

    if (index.type === "declaration") {
        const declaration = lawData.selectedContainerData.refData.referencedDeclarations.find(d => d.attr.declarationID === index.declarationID);
        if (!declaration) throw new Error("Declaration not found");
        const declContainer = lawData.analysis.sentenceEnvs[declaration.nameSentenceTextRange.start.sentenceIndex]?.container;
        if (!declContainer) return null;
        const containerID = declContainer.containerID;
        params.title = `「${declaration.text()}」`;
        params.element = <ContainersView containerIDs={[containerID]} htmlOptions={{ options: { lawData }, renderControlEL: true, WrapComponent: CommentLawWrapper }} />;

    } else if (index.type === "pointerTarget") {
        const pointerEnvTarget = index.target;

        if (pointerEnvTarget) {
            if (pointerEnvTarget.type === "external") {
                params.element = <ElawsPartialLawView {...pointerEnvTarget.props} {...{ htmlOptions }} />;
                params.title = `${pointerEnvTarget.props.lawTitle}（${pointerEnvTarget.props.lawNum}）${pointerEnvTarget.props.article ?? ""}${pointerEnvTarget.props.paragraph ?? ""}${pointerEnvTarget.props.appdxTable ?? ""}`;
            } else if (pointerEnvTarget.type === "internal") {
                params.element = <ContainersView containerIDs={pointerEnvTarget.containerIDs} htmlOptions={{ options: { lawData }, renderControlEL: true, WrapComponent: CommentLawWrapper }} />;
                params.title = pointerEnvTarget.containerIDs.map(containerID => getContainerTitle(lawData.analysis.containers.get(containerID)!).join("")).join("、");
            }
        }
    }

    // eslint-disable-next-line tailwindcss/no-custom-classname
    return <RefViewDiv data-ref_data_index={indexNumber} indexnumber={indexNumber} style={{ marginTop: "1rem" }} className="ref-view" onMouseEnter={refViewOnMouseEnter} onMouseLeave={refViewOnMouseLeave}>
        <h3 className="font-bold">【{indexNumber + 1}】{params.title}</h3>
        <div style={{ marginLeft: "2.25rem" }}>
            {params.element}
        </div>
    </RefViewDiv>;
};

export default RefView;


