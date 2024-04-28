import {
  Box,
  Button,
  Checkbox,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import Tree, { useTreeState } from 'react-hyper-tree';
import { TreeNode } from 'react-hyper-tree/dist/helpers/node';

import { Navbar } from './components/Navbar';
import { useTrrackTaskManager } from './store/trrack';
import { useRef } from 'react';
import { ScreenshotStream, downloadScreenshot } from '@trrack/core';

function App() {
  const trrackManager = useTrrackTaskManager();
  const { trrack } = trrackManager;
  const { actions } = trrackManager;

  const { required, handlers } = useTreeState({
    data: trrackManager.trrack.tree(),
    id: 'test',
    defaultOpened: true,
  });

  open(required.data, trrackManager.trrack.current.id);

  // Testing screenshot stream
  const ss = useRef(new ScreenshotStream());

  return (
    <Box sx={{ height: '100vh', width: '100vw' }}>
      <Navbar t={trrackManager} ss={ss.current} />
      <Button
        onClick={() => downloadScreenshot(ss.current.getNth(0), 'screenshot')}
      >
        Download Latest Screenshot
      </Button>
      <Button
        onClick={() => {
          ss.current.start();
        }}
      >
        Start recording
      </Button>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          padding: '1em',
        }}
      >
        <List>
          {trrackManager.state.tasks?.map((task) => (
            <ListItem key={task.id}>
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={task.completed}
                  onChange={() => {
                    if (task.completed)
                      trrack.apply(
                        `Mark ${task.desc} as not done`,
                        actions.markTaskIncomplete(task)
                      );
                    else
                      trrack.apply(
                        `Mark ${task.desc} as done`,
                        actions.markTaskComplete(task)
                      );
                  }}
                />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography
                    component="span"
                    sx={{
                      textDecoration: task.completed
                        ? 'line-through'
                        : 'default',
                    }}
                  >
                    {task.desc}
                  </Typography>
                }
              ></ListItemText>
            </ListItem>
          ))}
        </List>
        <Tree
          {...required}
          {...handlers}
          gapMode="margin"
          setSelected={(node) => trrackManager.trrack.to(node.id)}
        />
      </Box>
    </Box>
  );
}

export default App;

export function open(nodes: TreeNode[], current: string) {
  nodes.forEach((node) => {
    node.setSelected(current === node.id);
    node.setOpened(true);

    if (node.children) open(node.children, current);
  });
}
