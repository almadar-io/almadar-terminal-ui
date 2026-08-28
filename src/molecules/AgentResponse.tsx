import React from 'react';
import { Box as InkBox, Text } from 'ink';
import { Typography } from '../atoms/Typography.js';

const HEADING = /^(#{1,3})\s+(.*)$/;
const NUMBERED = /^(\d+)\.\s+(.*)$/;
const BOLD_SPLIT = /(\*\*[^*]+\*\*)/g;

/** Split a line on `**bold**` spans and render as one soft-wrapped `<Text>`
 *  with nested bold segments — handles inline bold anywhere in the line, not
 *  just a whole-line-wrapped case. */
function Inline({ line }: { line: string }): React.ReactElement {
  const parts = line.split(BOLD_SPLIT).filter((p) => p.length > 0);
  return (
    <Text wrap="wrap">
      {parts.map((part, i) =>
        part.startsWith('**') && part.endsWith('**') ? (
          <Text key={i} bold>{part.slice(2, -2)}</Text>
        ) : (
          <Text key={i}>{part}</Text>
        ),
      )}
    </Text>
  );
}

export interface AgentResponseProps {
  content: string;
}

/** Line-based prose renderer for assistant replies — headings, inline bold,
 *  bullets, numbered lists, blockquotes, code fences. Hand-rolled (no new
 *  dependency); not full CommonMark — no tables/links/nested lists. */
export function AgentResponse({ content }: AgentResponseProps): React.ReactElement {
  const lines = content.split('\n');
  let inCodeBlock = false;

  return (
    <InkBox flexDirection="column">
      {lines.map((line, i) => {
        const key = String(i);

        if (line.startsWith('```')) {
          inCodeBlock = !inCodeBlock;
          return <Text key={key} dimColor>{line}</Text>;
        }
        if (inCodeBlock) {
          return <Text key={key} dimColor>  {line}</Text>;
        }

        const heading = HEADING.exec(line);
        if (heading) {
          const level = heading[1]?.length ?? 3;
          const variant = level === 1 ? 'h1' : level === 2 ? 'h2' : 'h3';
          return <Typography key={key} variant={variant}>{heading[2]}</Typography>;
        }

        if (line.startsWith('> ')) {
          return (
            <InkBox key={key}>
              <Text dimColor>│ </Text>
              <Text dimColor italic>{line.slice(2)}</Text>
            </InkBox>
          );
        }

        if (line.startsWith('- ') || line.startsWith('* ')) {
          return (
            <InkBox key={key}>
              <Text>• </Text>
              <Inline line={line.slice(2)} />
            </InkBox>
          );
        }

        const numbered = NUMBERED.exec(line);
        if (numbered) {
          return (
            <InkBox key={key}>
              <Text dimColor>{numbered[1]}. </Text>
              <Inline line={numbered[2] ?? ''} />
            </InkBox>
          );
        }

        if (line.trim().length === 0) return <Text key={key}> </Text>;
        return <Inline key={key} line={line} />;
      })}
    </InkBox>
  );
}
