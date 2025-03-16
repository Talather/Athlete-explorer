import { Link } from 'react-router-dom'
import {
  FaHome,
  FaCoins,
  FaWallet,
  FaUser,
  FaQuestionCircle
} from 'react-icons/fa'

function MobileStickyBar() {
    const gradientIcon = {
  fontSize: '20px',
  marginBottom: '3px',
  background: 'linear-gradient(93deg, #ed9585, #8d4df5)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent'
}

  const styles = {
    wrapper: {
    //   position: 'fixed',
    //   bottom: 0,
    //   left: 0,
      width: '100%',
      backgroundColor: '#fff',
      borderTop: '1px solid #ddd',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      height: '60px',
      zIndex: 1000
    },
    menuItem: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '12px',
      color: '#000',
      textDecoration: 'none',
      width: '20%'
    },
    icon: {
      fontSize: '18px',
        marginBottom: '3px',
      
    }
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.menuItem}>
        <FaHome style={styles.icon} />
        <span>Home</span>
      </div>

      <Link to='/page' style={styles.menuItem}>
        <FaCoins style={styles.icon} />
        <span>FTO</span>
      </Link>

      <div style={styles.menuItem}>
        <FaWallet style={styles.icon} />
        <span>Wallet</span>
      </div>

      <div style={styles.menuItem}>
        <FaUser style={styles.icon} />
        <span>Settings</span>
      </div>

      <div style={styles.menuItem}>
        <FaQuestionCircle style={styles.icon} />
        <span>Help</span>
      </div>
    </div>
  )
}

export default MobileStickyBar
