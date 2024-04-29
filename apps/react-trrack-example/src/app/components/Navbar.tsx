import AddIcon from '@mui/icons-material/Add';
import RedoIcon from '@mui/icons-material/Redo';
import RemoveIcon from '@mui/icons-material/Remove';
import UndoIcon from '@mui/icons-material/Undo';
import { AppBar, Button, IconButton, Toolbar, Typography } from '@mui/material';

import { Trrack } from '../store/trrack';
import { Task } from '../store/types';
import { ScreenshotStream } from '@trrack/core';

export function Navbar({ t, ss }: { t: Trrack; ss: ScreenshotStream }) {
  const { trrack, isAtLatest, isAtRoot, actions, counter } = t;

  return (
    <>
      <AppBar sx={{ bgcolor: 'white' }}>
        <Toolbar>
          <Typography color="black" variant="h6" sx={{ flexGrow: 1 }}>
            Action based tracking with React
          </Typography>
          <IconButton
            onClick={() => {
              trrack.apply('Increment counter', actions.incrementCounter(1));
              ss.delayCapture(100);
            }}
          >
            <AddIcon />
          </IconButton>
          <Typography color="black" variant="h6">
            Counter: {counter}
          </Typography>
          <IconButton
            onClick={() => {
              trrack.apply('Decrement counter', actions.decrementCounter(1));
              ss.delayCapture(100);
            }}
          >
            <RemoveIcon />
          </IconButton>
          <Button
            sx={{ margin: '0.2em' }}
            variant="contained"
            onClick={() => {
              const taskNumber = Math.floor(Math.random() * 100);

              const task: Task = {
                id: Date.now().toString(),
                taskNumber,
                createdOn: Date.now(),
                desc: `Task ${taskNumber}`,
                completed: false,
              };
              trrack.apply(`Add task: ${taskNumber}`, actions.addTask(task));
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
