import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useApi } from '../../../api';

/*==========================================================
 * Logout component:
 *   Clears current API token
 */

export default function Logout({isTrained, setIsTrained, counter, setCounter}) {

  const [done, setDone] = useState(false);
  const api = useApi();
  const navigate = useNavigate();
  useEffect(() => {
    api.setToken(null);
    setIsTrained(false);
    setCounter(counter+1);
    navigate('/', { replace: true });
    setDone(true);
  }, [api]);
  return null;
}
