// Original code from: https://github.com/yamachig/Lawtext/blob/3387e09/core/src/renderer/rules/htmlCSS.tsx
import { HTMLIndentCSS, HTMLAdditionalCSS } from "lawtext/dist/src/renderer/rules/htmlCSS";
import { HTMLAmendProvisionCSS } from "lawtext/dist/src/renderer/rules/amendProvision";
import { HTMLAnyELsCSS } from "lawtext/dist/src/renderer/rules/any";
import { HTMLAppdxItemCSS } from "lawtext/dist/src/renderer/rules/appdxItem";
import { HTMLArithFormulaRunCSS } from "lawtext/dist/src/renderer/rules/arithFormulaRun";
import { HTMLArticleCSS } from "lawtext/dist/src/renderer/rules/article";
import { HTMLArticleGroupCSS } from "lawtext/dist/src/renderer/rules/articleGroup";
import { HTMLColumnsOrSentencesRunCSS } from "lawtext/dist/src/renderer/rules/columnsOrSentencesRun";
import { HTMLFigRunCSS } from "lawtext/dist/src/renderer/rules/figRun";
import { HTMLItemStructCSS } from "lawtext/dist/src/renderer/rules/itemStruct";
import { HTMLEnactStatementCSS, HTMLLawCSS, HTMLPreambleCSS } from "lawtext/dist/src/renderer/rules/law";
import { HTMLListCSS } from "lawtext/dist/src/renderer/rules/list";
import { HTMLNoteLikeCSS } from "lawtext/dist/src/renderer/rules/noteLike";
import { HTMLParagraphItemCSS } from "lawtext/dist/src/renderer/rules/paragraphItem";
import { HTMLQuoteStructRunCSS } from "lawtext/dist/src/renderer/rules/quoteStructRun";
import { HTMLRemarksCSS } from "lawtext/dist/src/renderer/rules/remarks";
import { HTMLSentenceChildrenRunCSS } from "lawtext/dist/src/renderer/rules/sentenceChildrenRun";
import { HTMLSupplNoteCSS } from "lawtext/dist/src/renderer/rules/supplNote";
import { HTMLTableCSS } from "lawtext/dist/src/renderer/rules/table";
import { HTMLTOCCSS } from "lawtext/dist/src/renderer/rules/toc";
import { createGlobalStyle } from "styled-components";

export const HTMLControlRunCSS = createGlobalStyle`
.control-parentheses
{
    transition: background-color 0.3s;
}

.control-parentheses
{
    background-color: color(from #0852b3 srgb r g b / 0.1);
    border-radius: 0.3em;
}

.control-start-parenthesis,
.control-end-parenthesis
{
    border: 1px solid transparent;
    margin: -1px;
    transition: border-color 0.3s;
}

.control-parentheses:hover
    > .control-start-parenthesis,
.control-parentheses:hover
    > .control-end-parenthesis
{
    border-color: gray;
}

.control-mismatch-start-parenthesis {
    color: red;
}

.control-mismatch-end-parenthesis {
    color: red;
}

.control-parentheses-content[data-parentheses_type="square"] {
    color: rgb(158, 79, 0);
}

body .paragraph-item-any:hover > * > .paragraph-item-decoration-left-border {
    border-left-color: transparent;
}
`;

export const htmlCSS = [
    HTMLIndentCSS,
    HTMLAdditionalCSS,

    HTMLAnyELsCSS,
    HTMLLawCSS,
    HTMLArticleGroupCSS,
    HTMLArticleCSS,
    HTMLParagraphItemCSS,
    HTMLTableCSS,
    HTMLItemStructCSS,
    HTMLAppdxItemCSS,
    HTMLRemarksCSS,
    HTMLNoteLikeCSS,
    HTMLListCSS,
    HTMLAmendProvisionCSS,
    HTMLSupplNoteCSS,
    HTMLEnactStatementCSS,
    HTMLPreambleCSS,
    HTMLTOCCSS,

    HTMLSentenceChildrenRunCSS,
    HTMLColumnsOrSentencesRunCSS,
    HTMLFigRunCSS,
    HTMLArithFormulaRunCSS,
    HTMLQuoteStructRunCSS,
].join("\n");

export const HTMLCSS = createGlobalStyle`
${htmlCSS}
`;
