
import { useState } from "react";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import PersonIcon from '@mui/icons-material/Person';
import HttpsOutlinedIcon from '@mui/icons-material/HttpsOutlined';
import CircularProgress from '@mui/material/CircularProgress';
import { useApi } from "../../../api";

export default function RequireLogin({ children }) {
  const api = useApi();
  if (api.loggedIn && api.isTokenExpired == false) {
    return <>{children}</>
  }
  else {
    api.setToken(null);
    return <><div className="background"></div><Login /></>
  }
}

export function Login() {
  const [hNumber, sethNumber] = useState('');
  const [PIN, setPIN] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const api = useApi();

  async function verifyCreds(e) {
    e.preventDefault();
    setLoading(true);
    let response = await api.login(hNumber, PIN);
    setLoading(false);
    if (response !== 401 && response !== 404) {
      await api.setToken(response);
      setError(false);
    } else {
      setPIN('');
      sethNumber('');
      setError(true);
    }
  }

  return (
    <>
      <div className="loginContainer">
        <form id="form-login" onSubmit={verifyCreds}>
          <PersonIcon color="primary" fontSize="small" id="loginIcon" />
          <TextField autoFocus
            error={error} className="form-input" style={{ marginBottom: '10px' }}
            label="hNumber" variant="outlined" value={hNumber}
            onChange={(e) => { sethNumber(e.target.value); setError(false) }}

          />
          <br />
          <HttpsOutlinedIcon color="primary" fontSize="small" id="loginIcon" />
          <TextField error={error} className="form-input" style={{ marginBottom: '10px' }} type="PIN" label="Contraseña" value={PIN} onChange={(e) => { setPIN(e.target.value); setError(false) }} />
          <br />
          {loading ? (
            <CircularProgress size={24} color="primary" style={{ marginTop: '10px' }} />
          ) : (
            <Button type="submit" variant="contained">Iniciar Sesión</Button>
          )}
        </form>
      </div>
    </>
  )
}
