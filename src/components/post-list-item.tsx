import { Image, Pressable, StyleSheet, Text, View } from 'react-native'

import { formatDistanceToNowStrict } from 'date-fns'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { Link } from 'expo-router'
import { Tables } from '../types/database.types'

type Post = Tables<'posts'> & {
	group: Tables<'groups'>
}

type PostListItemProps = {
	post: Post
	isDetailedPost?: boolean
}

export function PostListItem({ post, isDetailedPost }: PostListItemProps) {
	const shouldShowImage = isDetailedPost || post.image
	const shouldShowDescription = isDetailedPost || !post.image

	return (
		<Link
			href={`/post/${post.id}`}
			asChild>
			<Pressable style={styles.container}>
				<View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
					<Image
						source={{ uri: post.group.image }}
						style={styles.image}
					/>
					<View>
						<View style={{ flexDirection: 'row', gap: 5 }}>
							<Text style={{ fontWeight: 'bold', fontSize: 13, color: '#3A3B3C' }}>{post.group.name}</Text>
							<Text style={{ color: 'gray', fontSize: 13, alignSelf: 'flex-start' }}>
								{formatDistanceToNowStrict(new Date(post.created_at ?? ''))}
							</Text>
						</View>
						{isDetailedPost && <Text style={{ fontSize: 13, color: '#2E5DAA' }}>{post.user?.name}</Text>}
					</View>
					<Pressable
						onPress={() => console.error('Pressed')}
						style={{ marginLeft: 'auto', backgroundColor: '#0d469b', borderRadius: 10 }}>
						<Text
							style={{ color: 'white', paddingVertical: 2, paddingHorizontal: 7, fontWeight: 'bold', fontSize: 13 }}>
							Join
						</Text>
					</Pressable>
				</View>

				<Text style={{ fontWeight: 'bold', fontSize: 17 }}>{post.title}</Text>
				{shouldShowImage && post.image && (
					<Image
						source={{ uri: post.image }}
						style={{ width: '100%', aspectRatio: 16 / 9, borderRadius: 15 }}
					/>
				)}
				{shouldShowDescription && post.description && (
					<Text
						numberOfLines={isDetailedPost ? undefined : 4}
						style={{ marginTop: 5, marginBottom: 10 }}>
						{post.description}
					</Text>
				)}

				<View style={{ flexDirection: 'row' }}>
					<View style={{ flexDirection: 'row', gap: 10 }}>
						<View style={[{ flexDirection: 'row', gap: 5, alignItems: 'center' }, styles.iconBox]}>
							<MaterialCommunityIcons
								name='arrow-up-bold-outline'
								size={19}
								color='black'
							/>
							<Text style={{ fontWeight: 'bold' }}>{post.upvotes}</Text>
							<View style={{ width: 1, backgroundColor: '#D4D4D4', height: 14, marginHorizontal: 7 }} />
							<MaterialCommunityIcons
								name='arrow-down-bold-outline'
								size={19}
								color='black'
							/>
						</View>

						<View style={[{ flexDirection: 'row', gap: 5, alignItems: 'center' }, styles.iconBox]}>
							<MaterialCommunityIcons
								name='comment-outline'
								size={19}
								color='black'
							/>
							<Text style={{ fontWeight: 'bold' }}>{post.nr_of_comments}</Text>
						</View>
					</View>

					<View style={{ marginLeft: 'auto', flexDirection: 'row', gap: 10 }}>
						<MaterialCommunityIcons
							style={styles.iconBox}
							name='trophy-outline'
							size={19}
							color='black'
						/>
						<MaterialCommunityIcons
							style={styles.iconBox}
							name='share-outline'
							size={19}
							color='black'
						/>
					</View>
				</View>
			</Pressable>
		</Link>
	)
}

const styles = StyleSheet.create({
	container: {
		paddingVertical: 10,
		paddingHorizontal: 15,
		gap: 7,
		borderBottomColor: 'lightgrey',
		borderBottomWidth: 0.5,
		backgroundColor: 'white',
	},
	image: {
		width: 20,
		height: 20,
		borderRadius: 100,
		marginRight: 5,
	},
	iconBox: {
		borderWidth: 0.5,
		borderColor: '#D4D4D4',
		paddingHorizontal: 10,
		paddingVertical: 5,
		borderRadius: 20,
	},
})
