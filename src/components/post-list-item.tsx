import { Image, StyleSheet, Text, View } from 'react-native'

import { formatDistanceToNowStrict } from 'date-fns'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import posts from '../../assets/data/posts.json'

export function PostListItem() {
	const post = posts[0]

	return (
		<View style={styles.container}>
			<View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
				<Image
					source={{ uri: post.group.image }}
					style={styles.image}
				/>
				<Text style={{ fontWeight: 'bold' }}>{post.group.name}</Text>
				<Text style={{ color: 'gray' }}>{formatDistanceToNowStrict(new Date(post.created_at))}</Text>
				<View style={{ marginLeft: 'auto' }}>
					<Text style={styles.joinButton}>Join</Text>
				</View>
			</View>

			<Text style={{ fontWeight: 'bold', fontSize: 17 }}>{post.title}</Text>
			{post.image && (
				<Image
					source={{ uri: post.image }}
					style={{ width: '100%', aspectRatio: 16 / 9, borderRadius: 15 }}
				/>
			)}
			{!post.image && post.description && (
				<Text
					numberOfLines={4}
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
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		paddingVertical: 10,
		paddingHorizontal: 15,
	},
	image: {
		width: 20,
		height: 20,
		borderRadius: 100,
	},
	joinButton: {
		backgroundColor: '#0d469b',
		color: 'white',
		paddingHorizontal: 7,
		paddingVertical: 2,
		borderRadius: 10,
		fontWeight: 'bold',
	},
	iconBox: {
		borderWidth: 0.5,
		borderColor: '#D4D4D4',
		paddingHorizontal: 10,
		paddingVertical: 5,
		borderRadius: 20,
	},
})
