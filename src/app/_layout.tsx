import { Slot } from 'expo-router'
import { ClerkProvider } from '@clerk/clerk-expo'
import { tokenCache } from '@clerk/clerk-expo/token-cache'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useReactQueryDevTools } from '@dev-plugins/react-query'

const queryClient = new QueryClient()

export default function RootLayout() {
	useReactQueryDevTools(queryClient)

	return (
		<QueryClientProvider client={queryClient}>
			<ClerkProvider tokenCache={tokenCache}>
				<Slot />
			</ClerkProvider>
		</QueryClientProvider>
	)
}
