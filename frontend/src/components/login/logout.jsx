import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useApi } from '../../../api';

/*==========================================================
 * Logout component:
 *   Clears current API token
 */

export default function Logout() {
  const [done, setDone] = useState(false);
  const api = useApi();
  const navigate = useNavigate();
  // Must do the logout as an effect, because we cannot change other
  // components' state while rendering
  useEffect(() => {
    api.setToken(null);
    navigate('/', { replace: true });
    setDone(true);
  }, [api]);
  return null;
}
