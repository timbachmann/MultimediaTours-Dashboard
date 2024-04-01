import { useContext } from 'react'
import AuthContext from 'app/helpers/contexts/JWTAuthContext'

const useAuth = () => useContext(AuthContext)

export default useAuth
