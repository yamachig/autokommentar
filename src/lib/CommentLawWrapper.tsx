// Original code from: https://github.com/yamachig/Lawtext/blob/3387e09/app/src/components/LawView/LawWrapper.tsx
import React, { } from "react";
import type { WrapperComponentProps } from "lawtext/dist/src/renderer/common/html";
import { EL } from "lawtext/dist/src/node/el";
import * as std from "lawtext/dist/src/law/std";
import WrapHTMLControlRun from "./WrapHTMLControlRun";
import { containerTags } from "lawtext/dist/src/node/container";


export const containerInfoOf = (el: EL | string): {tag: string, id: string | number} => {
    if (typeof el === "string") {
        return { tag: "", id: "" };
    } else {
        return { tag: el.tag, id: el.id };
    }
};

const wrapperByID: Record<string, React.FC<WrapperComponentProps>> = {};

wrapperByID["HTMLControlRun"] = WrapHTMLControlRun;

export const CommentLawWrapper: React.FC<WrapperComponentProps> = props => {
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

    const dataset = [] as [string, unknown][];

    if (
        (el instanceof EL)
        && (containerTags.includes(el.tag as typeof containerTags[number]))
        && (!["TableRow", "TableColumn"].includes(el.tag as typeof containerTags[number]))
    ){
        dataset.push(["data-container_info", JSON.stringify(containerInfoOf(el))]);
    }

    const withDatasetElement = (
        dataset.length > 0
            ? <div {...Object.fromEntries(dataset)}>{baseElement}</div>
            : baseElement
    );


    return (<>
        {(typeof elID === "number") &&
            // eslint-disable-next-line tailwindcss/no-custom-classname
            <a className="law-anchor" data-el_id={elID.toString()} />
        }
        {withDatasetElement}
    </>);
};

export default CommentLawWrapper;
