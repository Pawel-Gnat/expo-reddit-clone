import { AntDesign, EvilIcons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { useState } from 'react'
import {
	ActivityIndicator,
	FlatList,
	Image,
	KeyboardAvoidingView,
	Platform,
	Pressable,
	Text,
	TextInput,
	View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { useSetAtom } from 'jotai'
import { selectedGroupAtom } from '../../atoms'
import { useQuery } from '@tanstack/react-query'
import { fetchGroups } from '../../services/group-service'
import { Tables } from '../../types/database.types'

type Group = Tables<'groups'>

export default function GroupSelector() {
	const setGroup = useSetAtom(selectedGroupAtom)
	const [searchText, setSearchText] = useState<string>('')

	const { data, isLoading, error } = useQuery({
		queryKey: ['groups', { searchText }],
		queryFn: () => fetchGroups(searchText),
		staleTime: 10_000,
		placeholderData: previousData => previousData,
	})

	const onGroupSelected = (group: Group) => {
		setGroup(group)
		router.back()
	}

	if (isLoading) {
		return <ActivityIndicator />
	}

	if (error || !data) {
		return <Text>Error fetching groups</Text>
	}

	return (
		<SafeAreaView style={{ marginHorizontal: 10, flex: 1 }}>
			<View style={{ flexDirection: 'row', alignItems: 'center' }}>
				<AntDesign
					name='close'
					size={30}
					color='black'
					onPress={() => router.back()}
				/>
				<Text
					style={{
						fontSize: 16,
						fontWeight: 'bold',
						textAlign: 'center',
						flex: 1,
						paddingRight: 30,
					}}>
					Post to
				</Text>
			</View>

			<View
				style={{
					flexDirection: 'row',
					backgroundColor: 'lightgrey',
					borderRadius: 5,
					gap: 5,
					marginVertical: 10,
					alignItems: 'center',
					paddingHorizontal: 5,
				}}>
				<EvilIcons
					name='search'
					size={16}
					color='gray'
				/>
				<TextInput
					placeholder='Search for a community'
					placeholderTextColor={'grey'}
					style={{ paddingVertical: 10, flex: 1 }}
					value={searchText}
					onChangeText={text => setSearchText(text)}
				/>
				{searchText && (
					<AntDesign
						name='close-circle'
						size={15}
						color='#E4E4E4'
						onPress={() => setSearchText('')}
					/>
				)}
			</View>

			<KeyboardAvoidingView
				behavior={Platform.OS === 'ios' ? 'padding' : undefined}
				style={{ flex: 1 }}>
				<FlatList
					data={data}
					renderItem={({ item }) => (
						<Pressable
							onPress={() => onGroupSelected(item)}
							style={{
								flexDirection: 'row',
								alignItems: 'center',
								gap: 5,
								marginBottom: 20,
							}}>
							<Image
								source={{ uri: item.image }}
								style={{ width: 40, aspectRatio: 1, borderRadius: 20 }}
							/>
							<Text style={{ fontWeight: '600' }}>{item.name}</Text>
						</Pressable>
					)}
				/>
			</KeyboardAvoidingView>
		</SafeAreaView>
	)
}
