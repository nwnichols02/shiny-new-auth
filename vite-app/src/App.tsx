import React from 'react'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AbilityProvider } from './ability/AbilityContext';

declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router
    }
}
const router = createRouter({
    routeTree,
    defaultPreload: 'intent',
})

const App = () => {
    const queryClient = new QueryClient();
    // Register things for typesafety
    return (
        <QueryClientProvider client={queryClient}>
            <AbilityProvider>
                <RouterProvider router={router} />
            </AbilityProvider>
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    )
}

export default App