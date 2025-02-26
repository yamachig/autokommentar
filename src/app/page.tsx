"use client";

import React from "react";
import { HTMLAnyELs } from "lawtext/dist/src/renderer/rules/any";
import type * as std from "lawtext/dist/src/law/std";
import TextLawWrapper from "../lib/TextLawWrapper";
import TocBar from "../lib/TocBar";
import styled from "styled-components";
import useLawData from "../lib/useLawData";
import { HTMLControlRunCSS, HTMLCSS } from "../lib/htmlCSS";
import RefView from "../lib/RefView";

const useHash = () => {
    const [hash, setHash] = React.useState(decodeURI(globalThis.window?.location.hash ?? ""));
    React.useEffect(() => {
        const onHashChange = () => {
            setHash(decodeURI(globalThis.window?.location.hash ?? ""));
        };
        globalThis.window?.addEventListener("hashchange", onHashChange);
        return () => globalThis.window?.removeEventListener("hashchange", onHashChange);
    }, []);
    return hash.replace(/^#/, "").replace(/^\//, "");
};


const TocBarScrollDiv = styled.div`
    scrollbar-width: thin;
    scrollbar-gutter: stable;
    scrollbar-color: #dbdbdb transparent;
    padding-top: 7rem;
    padding-bottom: 4rem;

    &:not(:hover) {
        scrollbar-color: transparent transparent;
        ::-webkit-scrollbar-thumb {
            background-color: transparent;
        }
        ::-webkit-scrollbar-track {
            background-color: transparent;
        }
    }
    transition: scrollbar-color 0.3s;
`;

const TextScrollDiv = styled.div`
    scrollbar-width: thin;
    scrollbar-gutter: stable;
    scrollbar-color: #dbdbdb transparent;
    &:not(:hover) {
        scrollbar-color: transparent transparent;
        ::-webkit-scrollbar-thumb {
            background-color: transparent;
        }
        ::-webkit-scrollbar-track {
            background-color: transparent;
        }
    }
    transition: scrollbar-color 0.3s;
`;

const CommentScrollDiv = styled.div`
    scrollbar-width: thin;
    scrollbar-gutter: stable;
    scrollbar-color: #dbdbdb transparent;
    padding-top: 6rem;
    padding-bottom: 4rem;

    &:not(:hover) {
        scrollbar-color: transparent transparent;
        ::-webkit-scrollbar-thumb {
            background-color: transparent;
        }
        ::-webkit-scrollbar-track {
            background-color: transparent;
        }
    }
    transition: scrollbar-color 0.3s;
`;

const TextDiv = styled.div`
    line-height: 1.75rem;
    font-size: 1rem;
    .control-parentheses {
        font-size: 0.85rem;
    }
`;

export default function Home() {
    const path = useHash();
    const { lawData } = useLawData(path);

    return (<>
        <HTMLCSS />
        <HTMLControlRunCSS />
        <div className="h-screen flex-row xl:mx-auto xl:flex">
            <div className="ml-auto hidden w-64 shrink-0 grow-0 xl:flex">
                <TocBarScrollDiv className="ml-4 flex overflow-x-hidden text-gray-600 xl:overflow-y-auto">
                    {lawData && <div className="w-full">
                        <TocBar
                            law={lawData.law}
                            firstPart={lawData.parsedPath.lawSpecifier}
                            containers={lawData.analysis.containersByEL ?? new Map()}
                            selectedContainer={lawData.selectedContainerData?.container ?? null}
                        />
                    </div>}
                </TocBarScrollDiv>
            </div>
            <TextScrollDiv className="flex flex-1 bg-white pb-12 pt-5 shadow-xl xl:max-w-3xl xl:overflow-y-auto">
                <div className="w-full flex-col px-12">
                    <div className="mx-auto mb-4 grow-0">
                        <h1 className="text-left text-2xl font-bold text-gray-600">AutoKommentar</h1>
                        {lawData && <>
                            <small className="font-bold text-gray-600">{lawData.law.children.find(el => el.tag === "LawBody")?.children.find(el => el.tag === "LawTitle")?.text() ?? ""}（{lawData.law.children.find(el => el.tag === "LawNum")?.text() ?? ""}）</small>
                        </>}
                    </div>
                    {lawData?.selectedContainerData && <>
                        <TextDiv className="mx-auto grow-0">
                            {lawData && <HTMLAnyELs els={[lawData.selectedContainerData.container.el as std.StdEL]} indent={0} htmlOptions={{ renderControlEL: true, WrapComponent: TextLawWrapper, options: { lawData } }} />}
                        </TextDiv>
                    </>}
                    {!lawData && <>
                        <div className="animate-pulse">
                            <div className="flex-1 space-y-6 py-1">
                                <div className="h-2 rounded bg-slate-200"></div>
                                <div className="space-y-3">
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="col-span-2 h-2 rounded bg-slate-200"></div>
                                        <div className="col-span-1 h-2 rounded bg-slate-200"></div>
                                    </div>
                                    <div className="h-2 rounded bg-slate-200"></div>
                                </div>
                                <div className="space-y-3">
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="col-span-1 h-2 rounded bg-slate-200"></div>
                                        <div className="col-span-2 h-2 rounded bg-slate-200"></div>
                                    </div>
                                    <div className="h-2 rounded bg-slate-200"></div>
                                </div>
                            </div>
                        </div>
                    </>}
                </div>
                <div className="mt-12 w-auto grow-0">
                    <br />
                </div>
            </TextScrollDiv>
            <CommentScrollDiv className="mr-auto flex-1 text-sm xl:max-w-3xl xl:overflow-y-auto">
                {lawData?.selectedContainerData && <>
                    <div className="px-4">
                        {lawData.selectedContainerData.refData.index.map((index, i) => <React.Fragment key={i}><RefView htmlOptions={{ options: { lawData } }} index={index} indexNumber={i}/></React.Fragment>)}
                    </div>
                </>}
            </CommentScrollDiv>
        </div>
        <a className="fixed bottom-0 right-0 m-2 rounded-md border border-white bg-slate-400 px-1 py-[0.1em] text-xs font-bold text-white" href="https://github.com/yamachig/autokommentar" target="_blank" rel="noreferrer">
            GitHub
        </a>
    </>);
}
