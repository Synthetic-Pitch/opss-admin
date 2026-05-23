import { Route, Routes, useParams } from 'react-router-dom'
import NotFound from './pages/NotFound'
import Landing from './pages/Landing'
import Admin from './pages/Admin'
import Test from './pages/test'
import VerifyPage from './components/verifyPage'
function UserPage() {
  const { userId } = useParams<{ userId: string }>()
  return <div>{userId}</div>
}

export default function App() {
  
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/admin/:plateNumber" element={<VerifyPage />} />
      <Route path="/test" element={<Test />} />

      <Route path="/:userId">
        <Route index element={<UserPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}