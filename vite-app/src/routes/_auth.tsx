import { createFileRoute, redirect } from '@tanstack/react-router'
import { useUser } from '../auth/auth'

export const Route = createFileRoute('/_auth')({
    beforeLoad: async () => {
        // Redirect to login if not authenticated
        const user = useUser()
        if (!user) {
            throw redirect({
                to: '/login'
            })
        }
    },
    component: RouteComponent,
})

function RouteComponent() {
    return <div>Hello "/_auth"!</div>
}
