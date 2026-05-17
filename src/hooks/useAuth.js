import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function useAuth() {
    const navigate = useNavigate()

    useEffect(() => {
        const token = localStorage.getItem('token')
        const time = localStorage.getItem('Time')
        if (!token || !time || Date.now() - Number(time) > 3600000) {
            localStorage.removeItem('token')
            localStorage.removeItem('Time')
            navigate('/login')
        }
    }, [])
}

export default useAuth;