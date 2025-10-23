import {
	ActivityIndicator,
	FlatList,
	KeyboardAvoidingView,
	Platform,
	Pressable,
	Text,
	TextInput,
	View,
} from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import { PostListItem } from '../../../components/post-list-item'
import comments from '../../../../assets/data/comments.json'
import CommentListItem from '../../../components/comment-list-item'
import { useCallback, useRef, useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useQuery } from '@tanstack/react-query'
import { fetchPostById } from '../../../services/post-service'
import { useSupabase } from '../../../lib/supabase'

export default function DetailedPost() {
	const { id } = useLocalSearchParams<{ id: string }>()
	const [comment, setComment] = useState<string>('')
	const [isInputFocused, setIsInputFocused] = useState<boolean>(false)
	const [replyToId, setReplyToId] = useState<string | null>(null)

	const inputRef = useRef<TextInput | null>(null)

	const insets = useSafeAreaInsets()
	const supabase = useSupabase()

	const {
		data: post,
		isLoading,
		error,
	} = useQuery({
		queryKey: ['posts', id],
		queryFn: () => fetchPostById(id, supabase),
	})

	console.log(post, id, isLoading, error)

	const createComment = () => {
		console.log('createComment')
	}

	const postComments = comments.filter(comment => comment.post_id === 'post-1')

	const handleReplyButtonPressed = useCallback((commentId: string) => {
		setReplyToId(commentId)
		inputRef.current?.focus()
	}, [])

	if (isLoading) {
		return <ActivityIndicator />
	}

	if (error || !post) {
		return <Text>Post Not Found</Text>
	}

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === 'ios' ? 'padding' : undefined}
			style={{ flex: 1 }}
			keyboardVerticalOffset={insets.top + 10}>
			<FlatList
				ListHeaderComponent={
					<PostListItem
						post={post}
						isDetailedPost
					/>
				}
				data={postComments}
				renderItem={({ item }) => (
					<CommentListItem
						comment={item}
						depth={0}
						handleReplyButtonPressed={handleReplyButtonPressed}
					/>
				)}
			/>
			<View
				style={{
					paddingBottom: insets.bottom,
					borderBottomColor: 'lightgray',
					padding: 10,
					backgroundColor: 'white',
					borderRadius: 10,
					shadowColor: '#000',
					shadowOffset: {
						width: 0,
						height: -3,
					},
					shadowOpacity: 0.1,
					shadowRadius: 3,
					elevation: 4,
				}}>
				<TextInput
					ref={inputRef}
					placeholder='Join the conversation'
					style={{ backgroundColor: '#E4E4E4', padding: 5, borderRadius: 5 }}
					value={comment}
					onChangeText={text => setComment(text)}
					multiline
					onFocus={() => setIsInputFocused(true)}
					onBlur={() => setIsInputFocused(false)}
				/>
				{isInputFocused && (
					<Pressable
						onPress={() => createComment()}
						style={{
							backgroundColor: '#0d469b',
							borderRadius: 15,
							marginLeft: 'auto',
							marginTop: 15,
						}}>
						<Text
							style={{
								color: 'white',
								paddingVertical: 5,
								paddingHorizontal: 10,
								fontWeight: 'bold',
								fontSize: 13,
							}}>
							Reply
						</Text>
					</Pressable>
				)}
			</View>
		</KeyboardAvoidingView>
	)
}
