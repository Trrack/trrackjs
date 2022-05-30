import { Box, Checkbox, List, ListItem, ListItemIcon, ListItemText, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import Tree, { useTreeState } from 'react-hyper-tree';
import { TreeNode } from 'react-hyper-tree/dist/helpers/node';

import { Navbar } from './components/Navbar';
import { TrrackContext, useTrrackSetup } from './store/trrack';
import { Task } from './store/types';

function App() {
  const [tasks, setTask] = useState<Task[]>([]);
  const trrack = useTrrackSetup();
  const { addAction } = trrack;

  useEffect(() => {
    addAction('add', {
      action(task: Task) {
        setTask((tasks) => [...tasks, task]);
      },
      inverse(task: Task) {
        setTask((tasks) => tasks.filter((t) => t.id !== task.id));
      },
    });

    addAction('complete', {
      action(task: Task) {
        setTask((tasks) => {
          const idx = tasks.findIndex((t) => t.id === task.id);

          if (idx === -1) return tasks;

          tasks[idx].completed = true;

          return [...tasks];
        });
      },
      inverse(task: Task) {
        setTask((tasks) => {
          const idx = tasks.findIndex((t) => t.id === task.id);

          if (idx === -1) return tasks;

          tasks[idx].completed = false;

          return [...tasks];
        });
      },
    });

    addAction('uncomplete', {
      action(task: Task) {
        setTask((tasks) => {
          const idx = tasks.findIndex((t) => t.id === task.id);

          if (idx === -1) return tasks;

          tasks[idx].completed = false;

          return [...tasks];
        });
      },
      inverse(task: Task) {
        setTask((tasks) => {
          const idx = tasks.findIndex((t) => t.id === task.id);

          if (idx === -1) return tasks;

          tasks[idx].completed = true;

          return [...tasks];
        });
      },
    });
  }, [addAction]);

  const { required, handlers } = useTreeState({
    data: trrack.trrack.tree,
    id: 'test',
    defaultOpened: true,
  });

  open(required.data, trrack.trrack.current.id);

  return (
    <TrrackContext.Provider value={trrack}>
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
                      if (task.completed)
                        trrack.trrack.apply({
                          name: 'uncomplete',
                          label: `Mark ${task.desc} as not done`,
                          doArgs: [task],
                          undoArgs: [task],
                        });
                      else
                        trrack.trrack.apply({
                          name: 'complete',
                          label: `Mark ${task.desc} as done`,
                          doArgs: [task],
                          undoArgs: [task],
                        });
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
            setSelected={(node) => trrack.trrack.to(node.id)}
          />
        </Box>
      </Box>
    </TrrackContext.Provider>
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
