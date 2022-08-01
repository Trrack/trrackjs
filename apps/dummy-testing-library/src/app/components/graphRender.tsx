import { Graph, IActionNode, IProvenanceNode, IStateNode } from '@trrack/core';
import { useMemo } from 'react';

import translate from '../utils/translate';

const SPACING = 150;
const YSPACING = SPACING * 0.5;
const NODE_SIZE = 6;

function useStateNodes(
  graph: Graph
): Array<{ node: IStateNode<any>; x: number; y: number }> {
  return graph
    .nodesBy<IStateNode<any>>(
      (node) => (node as IProvenanceNode).type === 'State'
    )
    .sort((a, b) => a.createdOn.getTime() - b.createdOn.getTime())
    .map((node, idx) => ({ node, x: SPACING * idx, y: 0 }));
}

function useActionNodes(graph: Graph) {
  const allActionNodes = graph
    .nodesBy<IActionNode<any>>(
      (node) => (node as IProvenanceNode).type === 'Action'
    )
    .sort((a, b) => a.createdOn.getTime() - b.createdOn.getTime());

  const actionNodes: Array<{
    node: IActionNode<any>;
    x: number;
    y: number;
  }> = [];
  const inverseActionNodes: Array<{
    node: IActionNode<any>;
    x: number;
    y: number;
  }> = [];

  allActionNodes
    .filter((node) => !node.isInverse)
    .forEach((node, idx) => {
      actionNodes.push({
        node,
        x: SPACING / 2 + SPACING * idx,
        y: YSPACING,
      });

      if (node.isInvertible) {
        const inverse = node.inverse;
        if (inverse) {
          inverseActionNodes.push({
            node: inverse,
            x: SPACING / 2 + SPACING * idx,
            y: -YSPACING,
          });
        }
      }
    });

  return {
    actionNodes,
    inverseActionNodes,
  };
}

export const GraphRenderer = ({ graph }: { graph: Graph }) => {
  const stateNodes = useStateNodes(graph);
  const { actionNodes, inverseActionNodes } = useActionNodes(graph);

  const nMap = useMemo(() => {
    const nm: {
      [key: string]: { node: IProvenanceNode; x: number; y: number };
    } = {};

    stateNodes.forEach((n) => (nm[n.node.id] = n));
    actionNodes.forEach((n) => {
      if (n) nm[n.node.id] = n;
    });
    inverseActionNodes.forEach((n) => {
      if (n) nm[n.node.id] = n;
    });

    return nm;
  }, [stateNodes, actionNodes, inverseActionNodes]);

  const getX = (id: string) => {
    return nMap[id].x;
  };

  const getY = (id: string) => {
    return nMap[id].y;
  };

  return (
    <g>
      {Array.from(graph.edges.values()).map((edge) => (
        <g key={edge.id}>
          {edge.type !== 'inverted_by' && edge.type !== 'inverts' ? (
            <line
              x1={getX(edge.from.id)}
              y1={getY(edge.from.id)}
              x2={getX(edge.to.id)}
              y2={getY(edge.to.id)}
              stroke="hsl(207, 51%, 83%)"
              strokeWidth="3px"
            />
          ) : edge.type === 'inverts' ? (
            <path
              stroke="hsl(207, 51%, 83%)"
              strokeWidth="3px"
              fill="none"
              d={`M ${getX(edge.from.id)} ${getY(edge.from.id)}
              C ${getX(edge.from.id) + 10} ${
                getY(edge.from.id) + (getY(edge.to.id) - getY(edge.from.id) / 2)
              } ${getX(edge.from.id) + 10} ${
                getY(edge.from.id) + (getY(edge.to.id) - getY(edge.from.id) / 2)
              }

              ${getX(edge.to.id)} ${getY(edge.to.id)}
              `}
            />
          ) : (
            <path
              stroke="hsl(207, 51%, 83%)"
              strokeWidth="3px"
              fill="none"
              d={`M ${getX(edge.from.id)} ${getY(edge.from.id)}
              C ${getX(edge.from.id) - 10} ${
                getY(edge.from.id) + (getY(edge.to.id) - getY(edge.from.id) / 2)
              } ${getX(edge.from.id) - 10} ${
                getY(edge.from.id) + (getY(edge.to.id) - getY(edge.from.id) / 2)
              }

              ${getX(edge.to.id)} ${getY(edge.to.id)}
              `}
            />
          )}
        </g>
      ))}

      {stateNodes.map(({ node, x, y }) => (
        <g key={node.id} transform={translate(x, y)}>
          <circle r={NODE_SIZE} fill="hsl(36, 5%, 19%)" />
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

      {actionNodes.map(({ node, x, y }) => {
        return (
          node && (
            <g key={node.id} transform={translate(x, y)}>
              <circle r={NODE_SIZE} fill="hsl(156, 86%, 28%)" />
              <text
                fontSize="15"
                textAnchor="middle"
                dominantBaseline="hanging"
                transform={translate(0, NODE_SIZE * 1.5)}
              >
                {node.label}
              </text>
            </g>
          )
        );
      })}

      {inverseActionNodes.map(({ node, x, y }) => {
        return (
          node && (
            <g key={node.id} transform={translate(x, y)}>
              <circle r={NODE_SIZE} fill="hsl(32, 90%, 59%)" />
              <text
                fontSize="15"
                textAnchor="middle"
                dominantBaseline="auto"
                transform={translate(0, -NODE_SIZE * 1.5)}
              >
                {node.label}
              </text>
            </g>
          )
        );
      })}
    </g>
  );
};
