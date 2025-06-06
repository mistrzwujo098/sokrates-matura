declare module 'react-katex' {
  import { FC, ReactNode } from 'react';
  
  interface KatexProps {
    children?: string;
    math?: string;
    block?: boolean;
    errorColor?: string;
    renderError?: (error: Error) => ReactNode;
    strict?: boolean | string | ((errorCode: string, errorMsg: string, token: any) => boolean);
    throwOnError?: boolean;
    maxSize?: number;
    maxExpand?: number;
    allowedProtocols?: string[];
    leqno?: boolean;
    fleqn?: boolean;
    minRuleThickness?: number;
    displayMode?: boolean;
    output?: 'html' | 'mathml' | 'htmlAndMathml';
  }
  
  export const InlineMath: FC<KatexProps>;
  export const BlockMath: FC<KatexProps>;
}
