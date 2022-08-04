import AddIcon from '@mui/icons-material/Add';
import RedoIcon from '@mui/icons-material/Redo';
import RemoveIcon from '@mui/icons-material/Remove';
import UndoIcon from '@mui/icons-material/Undo';
import { AppBar, Button, IconButton, Toolbar, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';

import { decrement, increment } from '../features/counter/counterSlice';
import { getPostById } from '../features/posts/postSlice';
import { addTodo } from '../features/todo/taskSlice';
import { AppDispatch, RootState, trrack } from '../store/store';

export const Navbar = () => {
  const counter = useSelector<RootState>((s) => s.counter.counter);
  const dispatch = useDispatch<AppDispatch>();
  const post = useSelector((state: RootState) => state.post);

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
              dispatch(getPostById(post.id === -1 ? 1 : post.id + 1) as any);
            }}
          >
            Fetch Next Post
          </Button>

          <IconButton
            onClick={() => {
              dispatch(increment());
            }}
          >
            <AddIcon />
          </IconButton>
          <Typography color="black" variant="h6">
            Counter: {counter as any}
          </Typography>
          <IconButton
            onClick={() => {
              dispatch(decrement());
            }}
          >
            <RemoveIcon />
          </IconButton>

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
