import { useAuth } from '../../hooks/useAuth';
import { useFcmMessaging } from '../../hooks/useFcmMessaging';

/**
 * Registers the browser for FCM Web Push after login.
 * Renders nothing — side-effect only.
 */
function FcmRegistrar() {
  const { isAuthenticated } = useAuth();
  useFcmMessaging(Boolean(isAuthenticated));
  return null;
}

export default FcmRegistrar;
