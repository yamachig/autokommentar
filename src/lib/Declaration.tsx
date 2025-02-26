// Original code from: https://github.com/yamachig/Lawtext/blob/3387e09/app/src/components/LawView/controls/Declaration.tsx
import React from "react";
import type { HTMLComponentProps } from "lawtext/dist/src/renderer/common/html";
import { HTMLSentenceChildrenRun } from "lawtext/dist/src/renderer/rules/sentenceChildrenRun";
import styled from "styled-components";
import type { SentenceChildEL } from "lawtext/dist/src/node/cst/inline";
import type { ____Declaration } from "lawtext/dist/src/node/el/controls/declaration";


const DeclarationSpan = styled.span`
    color: rgb(12, 126, 134);
`;

export interface ____DeclarationProps { el: ____Declaration }

export const Declaration = (props: HTMLComponentProps & ____DeclarationProps) => {
    const { el, htmlOptions } = props;
    return (
        <DeclarationSpan>
            <HTMLSentenceChildrenRun els={el.children as (string | SentenceChildEL)[]} {...{ htmlOptions }} />
        </DeclarationSpan>
    );
};

export default Declaration;
