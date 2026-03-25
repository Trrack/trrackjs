import { List, ListItemButton, ListItemText } from '@mui/material';

export type HistoryNode = {
  id: string;
  label: string;
  children: HistoryNode[];
};

function HistoryTreeBranch({
  currentNodeId,
  nodes,
  onSelect,
}: {
  currentNodeId: string;
  nodes: HistoryNode[];
  onSelect: (id: string) => void;
}) {
  return (
    <List disablePadding sx={{ pl: 2 }}>
      {nodes.map((node) => (
        <li key={node.id}>
          <ListItemButton
            selected={node.id === currentNodeId}
            onClick={() => onSelect(node.id)}
            sx={{
              borderRadius: 1,
              mb: 0.5,
            }}
          >
            <ListItemText primary={node.label} />
          </ListItemButton>
          {node.children.length > 0 ? (
            <HistoryTreeBranch
              currentNodeId={currentNodeId}
              nodes={node.children}
              onSelect={onSelect}
            />
          ) : null}
        </li>
      ))}
    </List>
  );
}

export function HistoryTree({
  currentNodeId,
  root,
  onSelect,
}: {
  currentNodeId: string;
  root: HistoryNode;
  onSelect: (id: string) => void;
}) {
  return (
    <HistoryTreeBranch
      currentNodeId={currentNodeId}
      nodes={[root]}
      onSelect={onSelect}
    />
  );
}
