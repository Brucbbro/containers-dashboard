import React from 'react'
import './App.css'
import ContainerDashboard from './components/ContainerDashboard'
import { useSingleton } from '@tippy.js/react'

export const TippyContext = React.createContext(null)


function App() {
    const tippySingleton = useSingleton({ delay: 300 })
    return (
      <TippyContext.Provider value={tippySingleton}>
          <div className="App">
              <div className='sidebar'>
                  <h2 style={{ color: 'white' }}>Sidebar</h2>
              </div>
              <div className="content">
                  <ContainerDashboard/>
              </div>
          </div>
      </TippyContext.Provider>

    )
}

export default App
