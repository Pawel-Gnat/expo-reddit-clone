import { AntDesign, Feather } from '@expo/vector-icons'
import { Link, router } from 'expo-router'
import { useState } from 'react'
import {
	Alert,
	Image,
	KeyboardAvoidingView,
	Platform,
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAtom } from 'jotai'
import { selectedGroupAtom } from '../../../atoms'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { insertPost } from '../../../services/post-service'
import { useSupabase } from '../../../lib/supabase'
import * as ImagePicker from 'expo-image-picker'
import { uploadImage } from '../../../utils/supabase-images'

export default function CreateScreen() {
	const [group, setGroup] = useAtom(selectedGroupAtom)
	const [title, setTitle] = useState('')
	const [bodyText, setBodyText] = useState('')
	const [image, setImage] = useState<string | null>(null)

	const queryClient = useQueryClient()
	const supabase = useSupabase()

	const { mutate, isPending } = useMutation({
		mutationFn: (image: string | undefined) => {
			if (!group) {
				throw new Error('Please select a group')
			}
			if (!title) {
				throw new Error('Title is required')
			}

			return insertPost(
				{
					title,
					description: bodyText,
					group_id: group.id,
					image,
				},
				supabase
			)
		},
		onSuccess: data => {
			queryClient.invalidateQueries({ queryKey: ['posts'] })
			goBack()
		},
		onError: error => {
			console.log(error)
			Alert.alert('Failed to insert post', error.message)
		},
	})

	const goBack = () => {
		setTitle('')
		setBodyText('')
		setGroup(null)
		router.back()
	}

	const onPostClick = async () => {
		let imagePath = image ? await uploadImage(image, supabase) : undefined
		mutate(imagePath)
	}

	const pickImage = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ['images'],
			allowsEditing: true,
			quality: 1,
		})

		if (!result.canceled) {
			setImage(result.assets[0].uri)
		}
	}

	return (
		<SafeAreaView style={{ backgroundColor: 'white', flex: 1, paddingHorizontal: 10 }}>
			<View style={{ flexDirection: 'row', alignItems: 'center' }}>
				<AntDesign
					name='close'
					size={30}
					color='black'
					onPress={() => goBack()}
				/>
				<Pressable
					onPress={() => onPostClick()}
					style={{ marginLeft: 'auto' }}
					disabled={isPending}>
					<Text style={styles.postText}>{isPending ? 'Posting...' : 'Post'}</Text>
				</Pressable>
			</View>

			<KeyboardAvoidingView
				behavior={Platform.OS === 'ios' ? 'padding' : undefined}
				style={{ flex: 1 }}>
				<ScrollView
					showsVerticalScrollIndicator={false}
					style={{ paddingVertical: 15 }}>
					<Link
						href={'group-selector'}
						asChild>
						<Pressable style={styles.communityContainer}>
							{group ? (
								<>
									<Image
										source={{ uri: group.image }}
										style={{ width: 20, height: 20, borderRadius: 10 }}
									/>
									<Text style={{ fontWeight: '600' }}>{group.name}</Text>
								</>
							) : (
								<>
									<Text style={styles.rStyles}>r/</Text>
									<Text style={{ fontWeight: '600' }}>Select a community</Text>
								</>
							)}
						</Pressable>
					</Link>
					<TextInput
						placeholder='Title'
						style={{ fontSize: 20, fontWeight: 'bold', paddingVertical: 20 }}
						value={title}
						onChangeText={text => setTitle(text)}
						multiline
						scrollEnabled={false}
					/>

					{image && (
						<View style={{ paddingBottom: 20 }}>
							<AntDesign
								name='close'
								size={25}
								color='white'
								onPress={() => setImage(null)}
								style={{
									position: 'absolute',
									zIndex: 1,
									right: 10,
									top: 10,
									padding: 5,
									backgroundColor: '#00000090',
									borderRadius: 20,
								}}
							/>
							<Image
								source={{ uri: image }}
								style={{ width: '100%', aspectRatio: 1 }}
							/>
						</View>
					)}

					<TextInput
						placeholder='body text (optional)'
						value={bodyText}
						onChangeText={text => setBodyText(text)}
						multiline
						scrollEnabled={false}
					/>
				</ScrollView>

				<View style={{ flexDirection: 'row', gap: 20, padding: 10 }}>
					<Feather
						name='link'
						size={20}
						color='black'
					/>
					<Feather
						name='image'
						size={20}
						color='black'
						onPress={pickImage}
					/>
					<Feather
						name='youtube'
						size={20}
						color='black'
					/>
					<Feather
						name='list'
						size={20}
						color='black'
					/>
				</View>
			</KeyboardAvoidingView>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	postText: {
		color: 'white',
		backgroundColor: '#115BCA',
		fontWeight: 'bold',
		paddingVertical: 2,
		paddingHorizontal: 7,
		borderRadius: 10,
	},
	rStyles: {
		backgroundColor: 'black',
		color: 'white',
		paddingVertical: 1,
		paddingHorizontal: 5,
		borderRadius: 10,
		fontWeight: 'bold',
	},
	communityContainer: {
		backgroundColor: '#EDEDED',
		flexDirection: 'row',
		padding: 10,
		borderRadius: 20,
		gap: 5,
		alignSelf: 'flex-start',
		marginVertical: 10,
	},
})
