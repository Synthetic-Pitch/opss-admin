import { Route, Routes, useParams } from 'react-router-dom'
import NotFound from './pages/NotFound'
import Landing from './pages/Landing'

function UserPage() {
  const { userId } = useParams<{ userId: string }>()

  return <div>{userId}</div>
}

export default function App() {
  return (
    <Routes>
      <Route path="/:userId">
        <Route index element={<UserPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
      <Route path="*" element={<NotFound />} />
      <Route path="/" element={<Landing />} />
    </Routes>
  )
}
