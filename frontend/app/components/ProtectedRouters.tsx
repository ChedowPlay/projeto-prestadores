import Loading from './Loading';
import { useAuthUser } from '../context/UserDataContext';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const ProtecaoRota = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthUser();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/Pages/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return Loading;
  }

  return <>{children}</>;
};

export default ProtecaoRota;
