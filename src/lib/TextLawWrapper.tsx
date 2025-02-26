import React, { } from "react";
import type { HTMLComponentProps, WrapperComponentProps } from "lawtext/dist/src/renderer/common/html";
import { EL } from "lawtext/dist/src/node/el";
import * as std from "lawtext/dist/src/law/std";
import { containerTags } from "lawtext/dist/src/node/container";
import { ____Declaration, ____LawNum, ____Pointer, ____VarRef } from "lawtext/dist/src/node/el/controls";
import type { HTMLControlRunProps } from "lawtext/dist/src/renderer/rules/controlRun";
import styled from "styled-components";
import type { LawData } from "./useLawData";
import Link from "next/link";
import { lawNumLikeToLawNum } from "lawtext/dist/src/law/lawNum";
import { HTMLSentenceChildrenRun } from "lawtext/dist/src/renderer/rules/sentenceChildrenRun";
import type { SentenceChildEL } from "lawtext/dist/src/node/cst/inline";
import Declaration from "./Declaration";
import { getPointerEnvTarget } from "./RefView";

const wrapperByID: Record<string, React.FC<WrapperComponentProps>> = {};

const DeclarationWrapperSpan = styled.span<{indexnumber: number}>`
    cursor: pointer;
    transition: background-color 0.3s;
    body[data-ref_data_index="${(props) => props.indexnumber}"] & {
        background-color: rgba(255, 238, 0, 0.4);
    }
`;

const UnderLineSpan = styled.span<{indexnumber: number}>`
    text-decoration: underline;
    text-decoration-thickness: 0.12em;
    text-underline-offset: 0.2em;
    cursor: pointer;
    transition: background-color 0.3s;
    body[data-ref_data_index="${(props) => props.indexnumber}"] & {
        background-color: rgba(255, 238, 0, 0.4);
    }
`;

const Sub = styled.sub`
    margin: 0 -0.5em 0 -0.4em;
    white-space: nowrap;
    bottom: -0.7em;
    left: -0.2em;
`;

export const WrapHTMLControlRun: React.FC<WrapperComponentProps> = props => {
    const { childProps, ChildComponent } = props;
    const { el, htmlOptions } = childProps as HTMLComponentProps & HTMLControlRunProps;
    const options = htmlOptions.options as { lawData: LawData };
    const { lawData } = options;

    const underLineSpanOnMouseEnter: React.MouseEventHandler<HTMLDivElement> = React.useCallback(e => {
        const indexNumber = e.currentTarget.dataset.ref_data_index;
        globalThis.window.document.body.dataset.ref_data_index = indexNumber;
    }, []);

    const underLineSpanOnMouseLeave: React.MouseEventHandler<HTMLDivElement> = React.useCallback(e => {
        const indexNumber = e.currentTarget.dataset.ref_data_index;
        if (globalThis.window.document.body.dataset.ref_data_index === indexNumber) {
            delete globalThis.window.document.body.dataset.ref_data_index;
        }
    }, []);

    const underLineSpanOnClick: React.MouseEventHandler<HTMLSpanElement> = e => {
        const refDataIndex = e.currentTarget.dataset.ref_data_index;
        if (!refDataIndex) return;
        const target = document.querySelector(`.ref-view[data-ref_data_index="${refDataIndex}"]`);
        if (!target) return;
        target.scrollIntoView({ behavior: "smooth" });
        target.classList.add("highlight");
        setTimeout(() => target.classList.remove("highlight"), 1000);
        target.scrollIntoView({ behavior: "smooth", block: "center" });
    };

    if (!options.lawData.selectedContainerData) {
        return <ChildComponent {...childProps} />;
    }

    if (el instanceof ____Declaration) {
        const declarationID = el.attr.declarationID;
        const index = options.lawData.selectedContainerData.refData.index.findIndex(
            (index) => index.type === "declaration" && index.declarationID === declarationID,
        );
        if (index >= 0) {
            return <DeclarationWrapperSpan data-ref_data_index={index} indexnumber={index} onClick={underLineSpanOnClick} onMouseEnter={underLineSpanOnMouseEnter} onMouseLeave={underLineSpanOnMouseLeave}>
                <Declaration el={el} {...{ htmlOptions }} />
            </DeclarationWrapperSpan>;
        } else {
            return <Declaration el={el} {...{ htmlOptions }} />;
        }

    } else if (el instanceof ____VarRef || el instanceof ____Pointer) {
        const index = (
            (el instanceof ____VarRef)
                ? options.lawData.selectedContainerData.refData.index.findIndex(
                    (index) => index.type === "declaration" && index.declarationID === el.attr.declarationID,
                )
                : options.lawData.selectedContainerData.refData.index.findIndex(
                    (index) => index.type === "pointerTarget" && index.targetString === JSON.stringify(getPointerEnvTarget(lawData.analysis.pointerEnvByEL.get(el)!)),
                )
        );

        return <>
            <UnderLineSpan data-ref_data_index={index} indexnumber={index} onClick={underLineSpanOnClick} onMouseEnter={underLineSpanOnMouseEnter} onMouseLeave={underLineSpanOnMouseLeave}>
                <ChildComponent {...childProps} />
            </UnderLineSpan>
            <Sub><strong>【{index + 1}】</strong></Sub>
        </>;

    } else if (el instanceof ____LawNum) {
        return (
            <Link href={`#/${lawNumLikeToLawNum(el.text())}`} target="_blank">
                <HTMLSentenceChildrenRun els={el.children as (string | SentenceChildEL)[]} {...{ htmlOptions }} />
            </Link>
        );

    } else {
        return <ChildComponent {...childProps} />;
    }
};

wrapperByID["HTMLControlRun"] = WrapHTMLControlRun;

export const TextLawWrapper: React.FC<WrapperComponentProps> = props => {
    const { htmlComponentID, childProps, ChildComponent } = props;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const el = (childProps as any).el;

    const elID = (
        (el instanceof EL)
        && (containerTags.includes(el.tag as typeof containerTags[number]) || std.isPreamble(el) || std.isTOC(el))
        && (!["TableRow", "TableColumn"].includes(el.tag as typeof containerTags[number]))
        && el.id
    );

    const WrapperByID = wrapperByID[htmlComponentID];

    const baseElement = (
        (WrapperByID)
            ? <WrapperByID {...props}/>
            : <ChildComponent {...childProps} />
    );

    return (<>
        {(typeof elID === "number") &&
            // eslint-disable-next-line tailwindcss/no-custom-classname
            <a className="law-anchor" data-el_id={elID.toString()} />
        }
        {baseElement}
    </>);
};

export default TextLawWrapper;
