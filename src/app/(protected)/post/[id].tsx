import { Text, View } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import posts from '../../../../assets/data/posts.json'
import { PostListItem } from '../../../components/post-list-item'
import Comments from '../../../../assets/data/comments.json'

export default function DetailedPost() {
	const { id } = useLocalSearchParams()
	const detailedPost = posts.find(post => post.id === id)

	if (!detailedPost) {
		return <Text>Post not found</Text>
	}

	return (
		<View>
			<PostListItem
				post={detailedPost}
				isDetailedPost
			/>
		</View>
	)
}
