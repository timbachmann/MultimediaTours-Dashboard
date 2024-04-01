import { useContext } from 'react'
import NotificationContext from 'app/helpers/contexts/NotificationContext'

const useNotification = () => useContext(NotificationContext)

export default useNotification
