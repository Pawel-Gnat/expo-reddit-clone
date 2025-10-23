import { AppState } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'
import { Database } from '../types/database.types'
import { useSession } from '@clerk/clerk-expo'

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!

export const useSupabase = () => {
	const { session } = useSession()

	return createClient<Database>(supabaseUrl, supabaseAnonKey, {
		auth: {
			storage: AsyncStorage,
			autoRefreshToken: true,
			persistSession: true,
			detectSessionInUrl: false,
		},
		global: {
			fetch: async (url, options = {}) => {
				const clerkToken = await session?.getToken({
					template: 'supabase',
				})

				const headers = new Headers(options?.headers)
				headers.set('Authorization', `Bearer ${clerkToken}`)

				return fetch(url, {
					...options,
					headers,
				})
			},
		},
	})
}
