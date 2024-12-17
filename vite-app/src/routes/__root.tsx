import * as React from 'react'
import { Link, Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <>
      <div className="p-2 flex gap-2 text-lg">
        <Link
          to="/"
          activeProps={{
            className: 'font-bold',
          }}
          activeOptions={{ exact: true }}
        >
          Home
        </Link>{' '}
        <Link
          to="/about"
          activeProps={{
            className: 'font-bold',
          }}
        >
          About
        </Link>
        <Link
          to="/audit"
          activeProps={{
            className: 'font-bold',
          }}
        >
          Audit
        </Link>
        <Link
          to="/login"
          activeProps={{
            className: 'font-bold',
          }}
        >
          Login
        </Link>
        <Link
          to="/permission"
          activeProps={{
            className: 'font-bold',
          }}
        >
          Permission
        </Link>
        <Link
          to="/roles"
          activeProps={{
            className: 'font-bold',
          }}
        >
          Roles
        </Link>
        <Link
          to="/rules"
          activeProps={{
            className: 'font-bold',
          }}
        >
          Rules
        </Link>
      </div>
      <hr />
      <Outlet />
      <TanStackRouterDevtools position="bottom-right" />
    </>
  )
}
