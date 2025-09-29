import Sidebar, { Navbar } from "../../admin/AdminNavBar"
import AdminNavBar from "../../admin/AdminNavBar"


const AdminLayout = ({ children }) => {
  return (
    <div className="flex bg-gray-100 font-sans antialiased h-screen">
      {/* Sidebar */}
      <Sidebar/>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen">
        <div className="flex-1 overflow-y-auto p-3">
          {children}
        </div>
      </main>
    </div>
  )
}

export default AdminLayout