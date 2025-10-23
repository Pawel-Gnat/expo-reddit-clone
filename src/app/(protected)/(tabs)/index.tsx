import { View, FlatList, ActivityIndicator, Text } from 'react-native'
import { PostListItem } from '../../../components/post-list-item'
import { useQuery } from '@tanstack/react-query'
import { fetchPosts } from '../../../services/post-service'
import { useSupabase } from '../../../lib/supabase'

export default function HomeScreen() {
	const supabase = useSupabase()

	const {
		data: posts,
		isLoading,
		error,
		refetch,
		isRefetching,
	} = useQuery({
		queryKey: ['posts'],
		queryFn: () => fetchPosts(supabase),
		staleTime: 1000 * 60 * 5,
	})

	if (isLoading) {
		return <ActivityIndicator />
	}

	if (error) {
		console.log(error)
		return <Text>Error fetching posts</Text>
	}

	return (
		<View>
			<FlatList
				data={posts}
				renderItem={({ item }) => <PostListItem post={item} />}
				onRefresh={refetch}
				refreshing={isRefetching}
			/>
		</View>
	)
}
