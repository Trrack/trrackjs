import {
  Box,
  Checkbox,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';

import { HistoryTree } from './components/HistoryTree';
import { Navbar } from './components/Navbar';
import { useTrrackTaskManager } from './store/trrack';

function App() {
  const trrackManager = useTrrackTaskManager();
  const { trrack } = trrackManager;
  const { actions } = trrackManager;

  return (
    <Box sx={{ height: '100vh', width: '100vw' }}>
      <Navbar t={trrackManager} />
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          padding: '1em',
        }}
      >
        <List>
          {trrackManager.state.tasks.map((task) => (
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
        <HistoryTree
          currentNodeId={trrack.current.id}
          root={trrack.tree()}
          onSelect={(id) => trrackManager.trrack.to(id)}
        />
      </Box>
    </Box>
  );
}

export default App;
