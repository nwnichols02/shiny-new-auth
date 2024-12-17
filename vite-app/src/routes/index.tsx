import * as React from 'react'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  beforeLoad: async () => {
    // Redirect to dashboard if authenticated
    // const { user } = useAuth()
    // if (user) {
    //   throw redirect({
    //     to: '/'
    //   })
    // }
    // return {}
  },
  component: HomeComponent
})

function HomeComponent() {
  return (
    <div className="p-2">
      <h3>Welcome Home!</h3>
    </div>
  )
}
