import { useMemo } from 'react';

import translate from '../utils/translate';

const SPACING = 150;
const NODE_SIZE = 6;

type RenderNode = {
  id: string;
  label: string;
  children: string[];
  createdOn: number;
  parent?: string;
};

export type GraphData = {
  nodes: Record<string, RenderNode>;
};

function useNodes(graph: GraphData) {
  return Object.values(graph.nodes)
    .sort((a, b) => a.createdOn - b.createdOn)
    .map((node, idx) => ({ node, x: SPACING * idx, y: 0 }));
}

export const GraphRenderer = ({
  currentNodeId,
  graph,
}: {
  currentNodeId: string;
  graph: GraphData;
}) => {
  const nodes = useNodes(graph);

  const nMap = useMemo(() => {
    const nm: {
      [key: string]: { node: RenderNode; x: number; y: number };
    } = {};

    nodes.forEach((n) => {
      nm[n.node.id] = n;
    });

    return nm;
  }, [nodes]);

  const getX = (id: string) => {
    return nMap[id].x;
  };

  const getY = (id: string) => {
    return nMap[id].y;
  };

  return (
    <g>
      {nodes
        .filter(({ node }) => node.parent)
        .map(({ node }) => (
          <line
            key={`${node.parent}-${node.id}`}
            x1={getX(node.parent as string)}
            y1={getY(node.parent as string)}
            x2={getX(node.id)}
            y2={getY(node.id)}
            stroke="hsl(207, 51%, 83%)"
            strokeWidth="3px"
          />
        ))}

      {nodes.map(({ node, x, y }) => (
        <g key={node.id} transform={translate(x, y)}>
          <circle
            r={NODE_SIZE}
            fill={
              node.id === currentNodeId ? 'hsl(156, 86%, 28%)' : 'hsl(36, 5%, 19%)'
            }
          />
          <text
            fontSize="15"
            textAnchor="middle"
            dominantBaseline="hanging"
            transform={translate(0, NODE_SIZE * 1.5)}
          >
            {node.label}
          </text>
        </g>
      ))}
    </g>
  );
};
