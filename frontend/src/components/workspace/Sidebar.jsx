import { Home, Plus, FolderOpen, Settings, User } from 'lucide-react'
import { Link } from 'react-router-dom'

function Sidebar({ currentProjectName = "Project 1" }) {
  const menuItems = [
    { icon: Home, label: 'Home', active: false },
    { icon: Plus, label: 'Create New', active: false },
    { icon: FolderOpen, label: 'Projects', active: false }
  ]

  return (
    <div className="w-64 bg-purple-700 text-white flex flex-col">
             {/* Logo/Brand */}
       <div className="p-6 border-b border-purple-600">
         <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
           <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
             <span className="text-purple-700 font-bold text-lg">P</span>
           </div>
           <span className="text-xl font-bold">Praxify</span>
         </Link>
       </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-2">
          {menuItems.map((item, index) => (
            <li key={index}>
              <button
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  item.active 
                    ? 'bg-purple-600 text-white' 
                    : 'text-purple-200 hover:bg-purple-600 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>

                 {/* Projects List */}
         <div className="mt-8">
           <h3 className="text-purple-300 text-sm font-medium px-4 mb-3">Recent Projects</h3>
           <ul className="space-y-1">
             <li>
               <button className="w-full text-left px-4 py-2 bg-purple-600 text-white rounded-lg transition-colors">
                 {currentProjectName}
               </button>
             </li>
             <li>
               <button className="w-full text-left px-4 py-2 text-purple-200 hover:bg-purple-600 hover:text-white rounded-lg transition-colors">
                 Project 2
               </button>
             </li>
             <li>
               <button className="w-full text-left px-4 py-2 text-purple-200 hover:bg-purple-600 hover:text-white rounded-lg transition-colors">
                 Project 3
               </button>
             </li>
           </ul>
         </div>
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-purple-600">
        <button className="w-full flex items-center space-x-3 px-4 py-3 text-purple-200 hover:bg-purple-600 hover:text-white rounded-lg transition-colors">
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </button>
                 <div className="mt-4 flex items-center space-x-3 px-4 py-2 hover:bg-purple-600 hover:text-white rounded-lg transition-colors cursor-pointer">
           <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
             <User className="w-4 h-4" />
           </div>
           <span className="text-sm text-purple-200">John Doe</span>
         </div>
      </div>
    </div>
  )
}

export default Sidebar