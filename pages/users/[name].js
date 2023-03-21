import NavBar from '@/components/NavBar'
import UserDetails from '@/components/UserDetails'
import { useRouter } from 'next/router'
import api from '../../serverCalls'

export default function User({ matches, users }) {
    const router = useRouter()
    const { name } = router.query
    return (
        <div>
            <NavBar />
            <UserDetails matches={matches} users={users} name={name} />
        </div>
    )
}

export async function getServerSideProps() {
    const matches = await api.fetchMatches();
    const users = await api.fetchUsers();
    return { props: { matches, users } }
}