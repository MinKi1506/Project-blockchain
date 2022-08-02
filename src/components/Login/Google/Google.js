import { signInWithGoogle } from './Auth';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login, addStatus } from '../../../reducers/userSlice';
import styles from './Google.module.css';
import apis from '../../../apis/index.js';

// 로그아웃은 카카오와 기능이 겹쳐 패스
const GoogleLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const googleLogin = async () => {
    const userAuth = await signInWithGoogle();
    dispatch(
      login({
        email: userAuth.user.email,
        name: userAuth.user.displayName,
      }),
    );

    const body = {
      id: userAuth.user.email,
    };

    await apis.post('/api/isUser', body).then((res) => {
      if (res.data.isUser) {
        //db에 유저정보있으면
        dispatch(
          addStatus({
            address: res.data.address,
            isLogin: true,
          }),
        );
        navigate('/');
      } else {
        //db에 유저정보없으면
        navigate('/register');
      }
    });
  };

  return (
    <div>
      <button className={styles.google} onClick={googleLogin}>
        구글 로그인
      </button>
    </div>
  );
};

export default GoogleLogin;
