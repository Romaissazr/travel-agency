import MainNavBar from '../Components/MainNavBar'
import Footer from '../Components/Footer'
import { Outlet } from 'react-router'

function Authentification() {
  return (
    <div>
      <MainNavBar/>
      <Outlet />
      <Footer />
    </div>
  )
}

export default Authentification
