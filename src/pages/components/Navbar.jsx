import { useNavigate } from 'react-router-dom'
import './Navbar.css'
import BoltIcon from '@mui/icons-material/Bolt';

function Navbar() {
  const user=JSON.parse(localStorage.getItem("user"));
  const profilePicUrl = {
    '1': "https://api.dicebear.com/7.x/adventurer/svg?seed=one",
    '2': "https://api.dicebear.com/7.x/adventurer/svg?seed=two",
    '3': "https://api.dicebear.com/7.x/adventurer/svg?seed=seventeen",
    '4': "https://api.dicebear.com/7.x/adventurer/svg?seed=four",
    '5': "https://api.dicebear.com/7.x/adventurer/svg?seed=five",
    '6': "https://api.dicebear.com/7.x/adventurer/svg?seed=six",
    '7': "https://api.dicebear.com/7.x/adventurer/svg?seed=seven",
    '8': "https://api.dicebear.com/7.x/adventurer/svg?seed=eight",
    '9': "https://api.dicebear.com/7.x/adventurer/svg?seed=sixteen",
    '10': "https://api.dicebear.com/7.x/adventurer/svg?seed=ten",
    '11': "https://api.dicebear.com/7.x/adventurer/svg?seed=fifteen",
    '12': "https://api.dicebear.com/7.x/adventurer/svg?seed=twelve",
    '13': "https://api.dicebear.com/7.x/adventurer/svg?seed=twentythree"
  };
  const navigate = useNavigate()
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <div className="nav-icon"><BoltIcon/></div>
        <span>TaskFlow</span>
      </div>
      <img className="navbar-avatar" src={profilePicUrl[user?.profile_pic || '3']} onClick={()=> navigate('/profile')} />
    </nav>
  )
}
export default Navbar