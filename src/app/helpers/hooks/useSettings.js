import { useContext } from 'react'
import SettingsContext from 'app/helpers/contexts/SettingsContext'

const useSettings = () => useContext(SettingsContext)

export default useSettings
