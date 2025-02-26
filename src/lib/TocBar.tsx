// Original code from: https://github.com/yamachig/Lawtext/blob/3387e09/app/src/components/Sidebar.tsx
import React from "react";
import styled from "styled-components";
import * as std from "lawtext/dist/src/law/std";
import type { EL } from "lawtext/dist/src/node/el";
import type { Container } from "lawtext/dist/src/node/container";
import makePath from "lawtext/dist/src/path/v1/make";


const SidebarBodyDiv = styled.div`
    flex-grow: 1;
    display: flex;
    flex-direction: column;
`;

const TOCItemDiv = styled.div`
    text-indent: -1em;
    overflow-x: hidden;
    overflow-y: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

const TOCItemAnchor = styled.a`
    display: block;
    color: currentColor;
    text-decoration: none;
    text-indent: -1em;
    overflow-x: hidden;
    overflow-y: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: pointer;
    &:hover {
        background-color: rgba(255, 255, 255, .8);
        color: currentColor;
    }
`;

const LawNavDiv = styled.div`
    flex-grow: 1;
    flex-basis: 0;
    padding: 0.4rem 0;
    font-size: 0.75em;
`;

interface TOCItemPropsForPath {
    containers: Map<EL, Container>,
    selectedContainer: Container | null,
    firstPart: string,
}

const TOCItem: React.FC<{el: std.StdEL, indent: number, text: string, disableLink?: boolean} & TOCItemPropsForPath> = props => {
    const container = props.containers.get(props.el);
    const path = (container && makePath(container)) ?? null;

    if (path && !props.disableLink) {
        const onClick: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
            window.location.hash = `/${props.firstPart}/${path}`;
            e.preventDefault();
            return false;
        };

        return (
            <TOCItemAnchor
                style={{
                    paddingLeft: (props.indent + 2) + "em",
                    ...(props.selectedContainer === container ? { backgroundColor: "rgba(0, 0, 0, 0.1)" } : {}),
                }}
                href={`#/${props.firstPart}/${path}`}
                onClick={onClick}
            >
                {props.text}
            </TOCItemAnchor>
        );

    } else {
        return (
            <TOCItemDiv
                style={{
                    paddingLeft: (props.indent + 2) + "em",
                }}
            >
                {props.text}
            </TOCItemDiv>
        );
    }

};

const NavArticleGroup: React.FC<{
    el: std.MainProvision | std.Part | std.Chapter | std.Section | std.Subsection | std.Division,
    indent: number,
} & TOCItemPropsForPath> = props => {
    return (<>
        {[...props.el.children].map((el, i) => {
            if (std.isArticleGroup(el)) {
                return <NavArticleGroup
                    {...props}
                    key={i}
                    el={el}
                    indent={props.el.tag === "MainProvision" ? props.indent : props.indent + 1}
                />;

            } else if (std.isArticle(el)) {
                return <NavArticle
                    {...props}
                    key={i}
                    el={el}
                    indent={props.el.tag === "MainProvision" ? props.indent : props.indent + 1}
                />;

            } else if (el.tag === "PartTitle" || el.tag === "ChapterTitle" || el.tag === "SectionTitle" || el.tag === "SubsectionTitle" || el.tag === "DivisionTitle") {
                return (
                    <TOCItem
                        {...props}
                        key={i}
                        text={el.text()}
                        disableLink={true}
                    />
                );

            } else {
                console.error(`unexpected element! ${JSON.stringify(el, undefined, 2)}`);
                return <NavAnyLaw
                    {...props}
                    key={i}
                    el={el}
                    indent={props.indent}
                />;

            }
        })}
    </>);
};

const NavArticle: React.FC<{el: std.Article, indent: number} & TOCItemPropsForPath> = props => {
    const articleCaption = props.el.children.find((el) => el.tag === "ArticleCaption") as std.ArticleCaption | undefined;
    const articleTitle = props.el.children.find((el) => el.tag === "ArticleTitle") as std.ArticleCaption | undefined;

    if (articleTitle) {
        const name = articleTitle.text();
        let text = name;
        if (articleCaption) {
            const appendText = articleCaption.text();
            text += (appendText[0] === "（" ? "" : "　") + appendText;
        }
        return (
            <TOCItem
                {...props}
                text={text}
            />
        );

    } else {
        return null;
    }
};

const NavSupplProvision: React.FC<{el: std.SupplProvision, indent: number} & TOCItemPropsForPath> = props => {
    const supplProvisionLabel = props.el.children.find((el) => el.tag === "SupplProvisionLabel") as std.SupplProvisionLabel | undefined;

    if (supplProvisionLabel) {
        const name = supplProvisionLabel.text();
        const amendLawNum = props.el.attr.AmendLawNum || "";
        // eslint-disable-next-line no-irregular-whitespace
        const text = (name + (amendLawNum ? ("（" + amendLawNum + "）") : "")).replace(/[\s　]+/, "");

        return (
            <TOCItem
                {...props}
                text={text}
            />
        );

    } else {
        return null;
    }
};

const NavAppdxTable: React.FC<{el: std.AppdxTable, indent: number} & TOCItemPropsForPath> = props => {
    const appdxTableTitle = props.el.children.find((el) => el.tag === "AppdxTableTitle") as std.AppdxTableTitle | undefined;

    if (appdxTableTitle) {

        return (
            <TOCItem
                {...props}
                text={appdxTableTitle.text()}
            />
        );

    } else {
        return null;
    }
};

const NavAppdxStyle: React.FC<{el: std.AppdxStyle, indent: number} & TOCItemPropsForPath> = props => {
    const appdxStyleTitle = props.el.children.find((el) => el.tag === "AppdxStyleTitle") as std.AppdxStyleTitle | undefined;

    if (appdxStyleTitle) {

        return (
            <TOCItem
                {...props}
                text={appdxStyleTitle.text()}
            />
        );

    } else {
        return null;
    }
};

const NavAppdxFig: React.FC<{el: std.AppdxFig, indent: number} & TOCItemPropsForPath> = props => {
    const AppdxFigTitle = props.el.children.find((el) => el.tag === "AppdxFigTitle") as std.AppdxFigTitle | undefined;

    if (AppdxFigTitle) {

        return (
            <TOCItem
                {...props}
                text={AppdxFigTitle.text()}
            />
        );

    } else {
        return null;
    }
};

const NavAppdxFormat: React.FC<{el: std.AppdxFormat, indent: number} & TOCItemPropsForPath> = props => {
    const appdxFormatTitle = props.el.children.find((el) => el.tag === "AppdxFormatTitle") as std.AppdxFormatTitle | undefined;

    if (appdxFormatTitle) {

        return (
            <TOCItem
                {...props}
                text={appdxFormatTitle.text()}
            />
        );

    } else {
        return null;
    }
};

const NavAppdxNote: React.FC<{el: std.AppdxNote, indent: number} & TOCItemPropsForPath> = props => {
    const appdxNoteTitle = props.el.children.find((el) => el.tag === "AppdxNoteTitle") as std.AppdxNoteTitle | undefined;

    if (appdxNoteTitle) {

        return (
            <TOCItem
                {...props}
                text={appdxNoteTitle.text()}
            />
        );

    } else {
        return null;
    }
};


const NavAppdx: React.FC<{el: std.Appdx, indent: number} & TOCItemPropsForPath> = props => {
    const ArithFormulaNum = props.el.children.find((el) => el.tag === "ArithFormulaNum") as std.ArithFormulaNum | undefined;

    if (ArithFormulaNum) {

        return (
            <TOCItem
                {...props}
                text={ArithFormulaNum.text()}
            />
        );

    } else {
        return null;
    }
};

const NavAnyLaw: React.FC<{el: std.StdEL, indent: number} & TOCItemPropsForPath> = props => {
    const titleEL = props.el.children.find(c => typeof c !== "string" && c.tag.includes("Title")) as EL | undefined || props.el;

    if (titleEL) {

        return (
            <TOCItem
                {...props}
                text={titleEL.text()}
            />
        );

    } else {
        return null;
    }
};

const LawBody: React.FC<{el: std.LawBody} & TOCItemPropsForPath> = props => {
    return (
        <>
            {props.el.children.map((el, i) => {
                if (el.tag === "LawTitle") {
                    return null;
                } else if (el.tag === "MainProvision") {
                    return <NavArticleGroup {...props} key={i} el={el} indent={0} />;
                } else if (el.tag === "SupplProvision" && (el.attr.AmendLawNum ?? "") === "") {
                    return <NavSupplProvision {...props} key={i} el={el} indent={0} />;
                } else if (el.tag === "AppdxTable") {
                    return <NavAppdxTable {...props} key={i} el={el} indent={0} />;
                } else if (el.tag === "AppdxStyle") {
                    return <NavAppdxStyle {...props} key={i} el={el} indent={0} />;
                } else if (el.tag === "AppdxFig") {
                    return <NavAppdxFig {...props} key={i} el={el} indent={0} />;
                } else if (el.tag === "AppdxNote") {
                    return <NavAppdxNote {...props} key={i} el={el} indent={0} />;
                } else if (el.tag === "AppdxFormat") {
                    return <NavAppdxFormat {...props} key={i} el={el} indent={0} />;
                } else if (el.tag === "Appdx") {
                    return <NavAppdx {...props} key={i} el={el} indent={0} />;
                } else {
                    return null;
                }
            })}
        </>
    );
};

const NavBlock: React.FC<{law: std.Law | null} & TOCItemPropsForPath> = props => {
    if (props.law) {
        const lawBody = props.law.children.find((el) => el.tag === "LawBody") as std.LawBody;
        return (
            <LawNavDiv>
                {/* <NavLaw {...props} el={props.law} indent={0} /> */}
                <LawBody {...props} el={lawBody}/>
            </LawNavDiv>
        );
    }
    return null;
};


export const TocBar: React.FC<{law: std.Law | null} & TOCItemPropsForPath> = props => {
    const MemoNavBlock = React.useMemo(() => React.memo(NavBlock), []);
    return (
        <SidebarBodyDiv className="pb-16">
            <MemoNavBlock {...props} law={props.law} />
        </SidebarBodyDiv>
    );
};

export default TocBar;
