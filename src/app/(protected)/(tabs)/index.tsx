import { View, FlatList, ActivityIndicator, Text } from 'react-native'
import { PostListItem } from '../../../components/post-list-item'
import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase'
import { Tables } from '../../../types/database.types'
import { useQuery } from '@tanstack/react-query'
import { fetchPosts } from '../../../services/postService'

type Post = Tables<'posts'> & {
	user: Tables<'users'>
	group: Tables<'groups'>
}

export default function HomeScreen() {
	const {
		data: posts,
		isLoading,
		error,
	} = useQuery({
		queryKey: ['posts'],
		queryFn: () => fetchPosts(),
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
			/>
		</View>
	)
}
