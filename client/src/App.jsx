
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Signin from './pages/Signin'
import AdminHomePage from './pages/AdminHomePage'
import AgentsHomePage from './pages/AgentsHomePage'
import About from './pages/About'
import Profile from './pages/Profile'
import Header from './components/Header'
import Private from './components/Private'
import RegisterAgents from './components/RegisterAgents'
import RegisterClients from './components/RegisterClients'
import ClientLogin from './pages/ClientLogin'
import Landing from './pages/Landing'
import ClientHomePage from './pages/ClientHomePage'
import SetPin from './pages/SetPin'
import ClientCheck from './pages/ClientCheck'
import AllTransactionsAGGrid from './pages/AllTransactions'
import WithdrawalsDashboard from './pages/Withdrawals'
import ClientProfile from './pages/ClientProfile'
import ClientOnly from './components/ClientOnly'


const App = () => {
  return (
    <BrowserRouter>
    <Header/>
      <Routes>
             <Route path="/" element={<Landing/>} />
             <Route path="/clientLogin" element={<ClientLogin/>} />
              <Route path='/signin' element={<Signin/>}/>
              <Route path='/setPin' element={<SetPin/>}/>
              <Route path='/check' element={<ClientCheck/>}/>
               
                <Route path='/about' element={<About/>}/>
        <Route element={<Private/>}>
       <Route element={<ClientOnly/>}>
         <Route path='/clientProfile' element={<ClientProfile/>}/>
         <Route path='/clientHome' element={<ClientHomePage/>}/>
       </Route>
    <Route path='/profile' element={<Profile/>}/>
        <Route path='/admin' element={<AdminHomePage/>}/>
        <Route path='/agent' element={<AgentsHomePage/>}/>
       
        <Route path='/allTransaction' element={<AllTransactionsAGGrid/>}/>
        <Route path='/registerAgent' element={<RegisterAgents/>}/>
        <Route path='/registerClient' element={<RegisterClients/>}/>
        <Route path='/withdrawal' element={<WithdrawalsDashboard/>}/>
        </Route>
        
      </Routes>
    </BrowserRouter>
  )
}

export default App
