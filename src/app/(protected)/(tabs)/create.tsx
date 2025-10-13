import { AntDesign, Feather } from '@expo/vector-icons'
import { Link, router } from 'expo-router'
import { useState } from 'react'
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function CreateScreen() {
	const [title, setTitle] = useState('')
	const [bodyText, setBodyText] = useState('')
	const [isPending, setIsPending] = useState(false)

	const goBack = () => {
		setTitle('')
		setBodyText('')
		// setGroup(null);
		router.back()
	}

	const onPostClick = () => {
		console.log('Post clicked')
	}

	const pickImage = () => {
		console.log('Image picked')
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
							<Text style={styles.rStyles}>r/</Text>
							<Text style={{ fontWeight: '600' }}>Select a community</Text>
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
