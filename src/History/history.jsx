import { useAuth0 } from '@auth0/auth0-react';
import { Delete, Save } from '@mui/icons-material';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  Radio,
  RadioGroup,
  TextField,
  useTheme,
} from '@mui/material';
import { useCallback, useEffect, useRef, useState } from 'react';
import PSAAuthButton from '../Authbutton';
import PSADropdown from '../Dropdown';
import PSAProfile from '../Profile';

export const historyServer = 'https://develophistory.covercrop-data.org/v1';
// export const historyServer = 'http://localhost:3002/v1';

const useConfirm = () => {
  const [state, setState] = useState({ open: false, message: '', resolve: null });

  const confirm = (message) =>
    new Promise((resolve) => {
      setState({ open: true, message, resolve });
    });

  const handleClose = (result) => {
    state.resolve?.(result);
    setState({ open: false, message: '', resolve: null });
  };

  const ConfirmDialog = () => (
    <Dialog open={state.open} onClose={() => handleClose(false)}>
      <DialogTitle>{state.message}</DialogTitle>
      <DialogActions>
        <Button onClick={() => handleClose(false)}>Cancel</Button>
        <Button color="error" onClick={() => handleClose(true)}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );

  return { confirm, ConfirmDialog };
};

const schemaId = 19;

const formatDate = (d) => {
  const date = new Date(d);

  const formatted = date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  return formatted.replace(' PM', 'p').replace(' AM', 'a');
};

export const PSAHistory = ({
  loadHistory = () => {},
  getStore = () => {},
  sx = {},
  compact = false,
  setAnchor = () => {},
}) => {
  const theme = useTheme();
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [histories, setHistories] = useState([]);
  const [label, setLabel] = useState('');
  const [id, setId] = useState('');
  const [firstTime, setFirstTime] = useState(true);

  const [saveOpen, setSaveOpen] = useState(false);
  const [saveMode, setSaveMode] = useState('overwriteCurrent');
  const [targetId, setTargetId] = useState('');
  const [newLabel, setNewLabel] = useState('');
  const [saveOpenProfile, setSaveOpenProfile] = useState(false);

  const inputRef = useRef(null);

  const { confirm, ConfirmDialog } = useConfirm();

  const getHistories = useCallback(async () => {
    if (!isAuthenticated) {
      return [];
    }

    const token = await getAccessTokenSilently();

    const url = `${historyServer}/histories?schema=${schemaId}`;
    const config = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await (await fetch(url, config)).json();
    setHistories(data);

    if (firstTime && data.length) {
      const first = data[0];
      loadHistory(first.json.history);
      setFirstTime(false);
      setLabel(first.label);
      setId(first.id);
      setTargetId(first.id);
    }

    return data;
  }, [isAuthenticated, getAccessTokenSilently, firstTime, loadHistory]);

  const createHistory = async (saveLabel) => {
    const token = await getAccessTokenSilently();
    const url = `${historyServer}/history`;

    const config = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        label: saveLabel,
        json: { ...getStore() },
        schemaId,
      }),
    };

    return await (await fetch(url, config)).json();
  };

  const updateHistory = async (saveId, saveLabel) => {
    const token = await getAccessTokenSilently();
    const url = `${historyServer}/history/${saveId}`;

    const config = {
      method: 'PUT',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        label: saveLabel,
        json: { ...getStore() },
        schemaId,
      }),
    };

    return await (await fetch(url, config)).json();
  };

  const deleteHistory = async (deleteId) => {
    const token = await getAccessTokenSilently();
    const url = `${historyServer}/history/${deleteId}`;

    const config = {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };

    await fetch(url, config);

    const remaining = histories.filter((history) => history.id !== deleteId);
    setHistories(remaining);

    if (deleteId === id) {
      if (remaining.length) {
        const first = remaining[0];
        loadHistory(first.json.history);
        setLabel(first.label);
        setId(first.id);
        setTargetId(first.id);
      } else {
        setLabel('');
        setId('');
        setTargetId('');
        setNewLabel('');
      }
    }
  };

  useEffect(() => {
    getHistories();
  }, [getHistories]);

  useEffect(() => {
    if (saveOpen && histories.length === 0) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  }, [saveOpen, histories.length]);

  const items = histories.map((d) => ({
    label: (
      <>
        <span>{d.label}</span>
        <span
          className="date"
          style={{ marginLeft: 'auto', fontSize: '0.75rem', color: '#888', paddingLeft: 10 }}
        >
          ({formatDate(d.updatedAt)})
        </span>
        <IconButton
          size="small"
          sx={{ ml: 2 }}
          onClick={async (e) => {
            e.stopPropagation();
            if (await confirm(`Delete ${d.label}?`)) {
              deleteHistory(d.id);
            }
          }}
        >
          <Delete fontSize="small" sx={{ color: 'error.main', opacity: 0.7 }} />
        </IconButton>
      </>
    ),
    value: d.id,
  }));

  const openSaveDialog = () => {
    setSaveMode(histories.length > 0 ? 'overwriteCurrent' : 'new');
    setTargetId(id || histories[0]?.id || '');
    setSaveOpen(true);
  };

  const handleSave = async () => {
    let savedId = id;
    let savedLabel = label;

    if (saveMode === 'overwriteCurrent') {
      if (!id) return;
      await updateHistory(id, label);
      savedId = id;
      savedLabel = label;
    } else if (saveMode === 'overwriteExisting') {
      const selected = histories.find((d) => d.id === targetId);
      if (!selected) return;
      await updateHistory(selected.id, selected.label);
      savedId = selected.id;
      savedLabel = selected.label;
    } else if (saveMode === 'new') {
      const trimmed = newLabel.trim();
      if (!trimmed) return;

      await createHistory(trimmed);
      savedLabel = trimmed;
    }

    const refreshed = await getHistories();

    if (saveMode === 'new') {
      const created = refreshed.find((d) => d.label === savedLabel);
      if (created) {
        setId(created.id);
        setLabel(created.label);
        setTargetId(created.id);
      }
    } else {
      const saved = refreshed.find((d) => d.id === savedId);
      if (saved) {
        setId(saved.id);
        setLabel(saved.label);
        setTargetId(saved.id);
      }
    }

    setSaveOpen(false);
  };

  return (
    <>
      <Dialog open={saveOpen} onClose={() => setSaveOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Save History</DialogTitle>
        <DialogContent>
          <RadioGroup value={saveMode} onChange={(e) => setSaveMode(e.target.value)}>
            {histories.length > 0 ? (
              <FormControlLabel
                value="overwriteCurrent"
                control={<Radio />}
                label={`Overwrite current${label ? ` (${label})` : ''}`}
              />
            ) : null}

            {histories.length > 1 ? (
              <FormControlLabel
                value="overwriteExisting"
                control={<Radio />}
                label="Overwrite different saved history"
              />
            ) : null}

            {saveMode === 'overwriteExisting' ? (
              <PSADropdown
                label="Replace"
                items={histories.map((d) => ({
                  label: d.label,
                  value: d.id,
                }))}
                formSx={{ mt: 1, minWidth: '12rem' }}
                SelectProps={{ value: targetId, onChange: (e) => setTargetId(e.target.value) }}
              />
            ) : null}

            <FormControlLabel value="new" control={<Radio />} label="Save as new history" />
          </RadioGroup>

          {saveMode === 'new' ? (
            <TextField
              inputRef={inputRef}
              autoFocus
              fullWidth
              margin="dense"
              label="New label"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
            />
          ) : null}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSaveOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={saveOpenProfile} onClose={() => setSaveOpenProfile(false)} fullWidth>
        <DialogContent>
          <PSAProfile />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSaveOpenProfile(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>

      <Box
        sx={{
          display: 'flex',
          flexDirection: compact ? 'column' : 'row',
          alignItems: compact ? 'stretch' : 'center',
          gap: 1,
          minWidth: compact ? 200 : 'auto',
          height: compact ? 'auto' : 30,
          ...sx,
        }}
      >
        <ConfirmDialog />
        {histories.length ? (
          <PSADropdown
            label={compact ? undefined : 'Saved'}
            items={items}
            formSx={{
              width: compact ? '100%' : '8rem',
              minWidth: compact ? '100%' : '8rem',
              div: { p: '0.2rem !important' },
              button: { display: 'none' },
              '.date': { display: 'none' },
              pl: compact ? 0.8 : undefined,
              pr: compact ? 0.8 : undefined,
            }}
            SelectProps={{
              value: id,
              onChange: (e) => {
                const selected = histories.find((d) => d.id === e.target.value);
                if (!selected) return;
                loadHistory(selected.json.history);
                setLabel(selected.label);
                setId(selected.id);
                if (compact) setAnchor(null);
              },
            }}
          />
        ) : null}
        {isAuthenticated ? (
          <Button
            sx={{
              fontFamily: 'IBM Plex Sans',
              fontSize: compact ? '0.9rem' : '1rem',
              fontWeight: compact ? 'bold' : '',
              borderRadius: '8px',
              pt: 0,
              pb: 0,
              justifyContent: compact ? 'flex-start' : 'center',
              textTransform: compact ? 'none' : 'uppercase',
              color: compact ? theme.palette.additional.greydark : '',
            }}
            variant={compact ? 'text' : 'contained'}
            endIcon={<Save />}
            onClick={openSaveDialog}
            fullWidth={compact}
          >
            Save
          </Button>
        ) : null}
        {isAuthenticated ? (
          compact ? (
            <Button
              onClick={() => {
                setSaveOpenProfile(true);
                setAnchor(null);
              }}
              fullWidth
              sx={{
                justifyContent: 'flex-start',
                color: theme.palette.additional.greydark,
                textTransform: 'none',
                fontFamily: 'IBM Plex Sans',
                fontSize: compact ? '0.9rem' : '1rem',
                fontWeight: compact ? 'bold' : '',
                pt: 0,
                pb: 0,
              }}
            >
              Profile
            </Button>
          ) : (
            <Box
              sx={{
                cursor: 'pointer',
                background: '#3B82F6',
                width: 30,
                height: 30,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onClick={() => setSaveOpenProfile(true)}
            >
              {user?.name?.[0]}
            </Box>
          )
        ) : null}
        <Box sx={{ order: 999 }}>
          <PSAAuthButton />
        </Box>
      </Box>
    </>
  );
};
