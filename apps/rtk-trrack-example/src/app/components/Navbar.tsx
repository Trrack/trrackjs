import RedoIcon from '@mui/icons-material/Redo';
import UndoIcon from '@mui/icons-material/Undo';
import { AppBar, Button, Toolbar, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';

import { addTodo } from '../features/todo/taskSlice';
import { AppDispatch, trrack } from '../store/store';

export const Navbar = () => {
  const dispatch = useDispatch<AppDispatch>();

  return (
    <>
      <AppBar sx={{ bgcolor: 'white' }}>
        <Toolbar>
          <Typography color="black" variant="h6" sx={{ flexGrow: 1 }}>
            Action based tracking with Redux-Toolkit
          </Typography>
          <Button
            sx={{ margin: '0.2em' }}
            variant="contained"
            onClick={() => {
              dispatch(addTodo(`Task ${Math.floor(Math.random() * 100)}`));
            }}
          >
            Add Random Task
          </Button>
          <Button
            sx={{ margin: '0.2em' }}
            variant="contained"
            startIcon={<UndoIcon />}
            disabled={trrack.root.id === trrack.current.id}
            onClick={() => trrack.undo()}
          >
            Undo
          </Button>
          <Button
            sx={{ margin: '0.2em' }}
            variant="contained"
            startIcon={<RedoIcon />}
            disabled={trrack.current.children.length === 0}
            onClick={() => trrack.redo()}
          >
            Redo
          </Button>
        </Toolbar>
      </AppBar>
      <Toolbar />
    </>
  );
};
