import { Redirect, Stack, router } from 'expo-router'
import { useAuth } from '@clerk/clerk-expo'
import { AntDesign, MaterialIcons, Entypo, EvilIcons } from '@expo/vector-icons'
import { View } from 'react-native'

export default function AppLayout() {
	const { isSignedIn } = useAuth()

	if (!isSignedIn) {
		return <Redirect href={'/sign-in'} />
	}

	return (
		<Stack>
			<Stack.Screen
				name='(tabs)'
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name='group-selector'
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name='post/[id]'
				options={{
					headerTitle: '',
					headerStyle: { backgroundColor: '#FF5700' },
					animation: 'slide_from_bottom',
					headerBackButtonDisplayMode: 'minimal',
					headerLeft: () => (
						<AntDesign
							name='close'
							size={24}
							color='white'
							onPress={() => router.back()}
						/>
					),
					headerRight: () => (
						<View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
							<EvilIcons
								name='search'
								size={24}
								color='white'
							/>
							<MaterialIcons
								name='sort'
								size={27}
								color='white'
							/>
							<Entypo
								name='dots-three-horizontal'
								size={24}
								color='white'
							/>
						</View>
					),
				}}
			/>
		</Stack>
	)
}
