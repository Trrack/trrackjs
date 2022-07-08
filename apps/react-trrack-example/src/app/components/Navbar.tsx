import RedoIcon from '@mui/icons-material/Redo';
import UndoIcon from '@mui/icons-material/Undo';
import { AppBar, Button, Toolbar, Typography } from '@mui/material';

import { useTrrack } from '../store/trrack';
import { Task } from '../store/types';

export function Navbar() {
  const { trrack, isAtLatest, isAtRoot } = useTrrack();

  return (
    <>
      <AppBar sx={{ bgcolor: 'white' }}>
        <Toolbar>
          <Typography color="black" variant="h6" sx={{ flexGrow: 1 }}>
            Action based tracking with React
          </Typography>
          <Button
            sx={{ margin: '0.2em' }}
            variant="contained"
            onClick={() => {
              const taskNumber = Math.floor(Math.random() * 100);

              const task: Task = {
                id: Date.now().toString(),
                createdOn: Date.now(),
                desc: `Task ${Math.floor(Math.random() * 100)}`,
                completed: false,
              };
              trrack.apply({
                name: 'add',
                label: `Add task: ${taskNumber}`,
                args: [task],
              });
            }}
          >
            Add Random Task
          </Button>
          <Button
            sx={{ margin: '0.2em' }}
            variant="contained"
            startIcon={<UndoIcon />}
            disabled={isAtRoot}
            onClick={() => trrack.undo()}
          >
            Undo
          </Button>
          <Button
            sx={{ margin: '0.2em' }}
            variant="contained"
            startIcon={<RedoIcon />}
            disabled={isAtLatest}
            onClick={() => trrack.redo()}
          >
            Redo
          </Button>
        </Toolbar>
      </AppBar>
      <Toolbar />
    </>
  );
}
