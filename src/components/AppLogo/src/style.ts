import { createStyles } from 'antd-style';

export default createStyles(({ token, css }) => {
  return {
    appLogo: {
      display: 'flex',
      alignItems: 'center',
      height: token.sizeXXL,
      marginLeft: token.marginLG,
      cursor: 'pointer',
      transaction: 'all 0.2 ease',
    },
    logoImg: {
      display: 'block',
      width: '32px',
      height: '32px',
    },
    logoName: css`
      display: block;
      width: auto;
      height: 40px;
      text-align: left;
      line-height: 40px;
      color: #fff;
      font-weight: 600;
      font-size: 16px;

      &.hidden {
        display: none;
      }
    `,
  };
});
