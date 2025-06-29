import logoImg from '@/assets/images/logo.png';
import { appSetting } from '@/settings/appBaseSetting';
import { useAppSelector } from '@/stores';
import { Space } from 'antd';
import classNames from 'classnames';
import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import useStyles from './style';

const AppLogo: FC = () => {
  const { styles } = useStyles();
  const navigate = useNavigate();
  const getMenuFold = useAppSelector((state) => state.app.appConfig?.menuSetting?.menuFold);

  const handleClick = () => {
    navigate('/home');
  };

  return (
    <div className="container mx-auto" onClick={handleClick}>
      <Space className="mx-auto flex justify-center items-center">
        {/* 图标 */}
        <img className={styles.logoImg} src={logoImg} alt="logo" />
        {/* 名称 */}
        <div className={classNames(styles.logoName, { hidden: getMenuFold })}>{appSetting.name}</div>
      </Space>
    </div>
  );
};

export default AppLogo;
