import {
  Box,
  Checkbox,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import React from 'react';
import { Tree, useTreeState } from 'react-hyper-tree';
import { TreeNode } from 'react-hyper-tree/dist/helpers/node';
import { useDispatch, useSelector } from 'react-redux';

import { Navbar } from './components/Navbar';
import { setTodoStatus } from './features/todo/taskSlice';
import { AppDispatch, RootState, trrack } from './store/store';

function App() {
  const tasks = useSelector((state: RootState) => state.tasks);
  const dispatch = useDispatch<AppDispatch>();
  const counter = useSelector<RootState>((state) => state.counter.counter);

  const { required, handlers } = useTreeState({
    data: trrack.tree(),
    id: 'test',
    defaultOpened: true,
  });

  open(required.data, trrack.current.id);

  return (
    <Box sx={{ height: '100vh', width: '100vw' }}>
      <Navbar />
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          padding: '1em',
        }}
      >
        <List>
          {tasks.map((task) => (
            <ListItem key={task.id}>
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={task.completed}
                  onChange={() => {
                    dispatch(
                      setTodoStatus({
                        id: task.id,
                        completed: !task.completed,
                      })
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
                    {task.description}
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
          setSelected={(node) => trrack.to(node.id)}
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
