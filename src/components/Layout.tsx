import Header from "./Header"
import { Outlet } from "react-router-dom"

const Layout = () => {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <footer>importera footer komponent istället</footer>
    </>
  )
}

export default Layout