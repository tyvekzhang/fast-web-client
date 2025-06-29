import { createStyles } from 'antd-style';

export default createStyles(({ css }) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    padding: 4,
  },
  searchContainer: {
    width: '100%',
    borderBottom: '1px solid #0505050F',
  },
  resultContainer: {
    width: '100%',
  },
  resultSearch: {
    display: 'flex',
    width: '100%',
    padding: '16px 0 0 24px',
    backgroundColor: '#fff',
  },
}));
