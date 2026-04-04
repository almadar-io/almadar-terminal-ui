import React from 'react';
import { Box, Text } from 'ink';

export interface TreeNode {
  name: string;
  children?: TreeNode[];
}

export interface TreeProps {
  data: TreeNode;
  depth?: number;
}

function TreeItem({ node, prefix, isLast }: { node: TreeNode; prefix: string; isLast: boolean }): React.ReactElement {
  const connector = isLast ? '└── ' : '├── ';
  const childPrefix = prefix + (isLast ? '    ' : '│   ');
  const hasChildren = node.children && node.children.length > 0;

  return (
    <Box flexDirection="column">
      <Text>
        <Text dimColor>{prefix}{connector}</Text>
        <Text bold={hasChildren}>{node.name}</Text>
      </Text>
      {node.children?.map((child, i) => (
        <TreeItem
          key={i}
          node={child}
          prefix={childPrefix}
          isLast={i === (node.children?.length ?? 0) - 1}
        />
      ))}
    </Box>
  );
}

export function Tree({ data }: TreeProps): React.ReactElement {
  return (
    <Box flexDirection="column">
      <Text bold>{data.name}</Text>
      {data.children?.map((child, i) => (
        <TreeItem
          key={i}
          node={child}
          prefix=""
          isLast={i === (data.children?.length ?? 0) - 1}
        />
      ))}
    </Box>
  );
}
