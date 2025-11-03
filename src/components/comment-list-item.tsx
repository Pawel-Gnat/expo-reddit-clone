import { View, Text, Pressable } from 'react-native'
import { Entypo, Octicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { memo, useState } from 'react'
import { Tables } from '../types/database.types'
import { useSession } from '@clerk/clerk-expo'
import { useSupabase } from '../lib/supabase'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { deleteComment, fetchCommentReplies } from '../services/comments-service'

type Comment = Tables<'comments'>

type CommentListItemProps = {
	comment: Comment
	depth: number
	handleReplyButtonPressed: (commentId: string) => void
}

const CommentListItem = ({ comment, depth, handleReplyButtonPressed }: CommentListItemProps) => {
	const [showReplies, setShowReplies] = useState(false)
	const { session } = useSession()

	const supabase = useSupabase()
	const queryClient = useQueryClient()

	const { data: replies } = useQuery({
		queryKey: ['comments', { parentId: comment.id }],
		queryFn: () => fetchCommentReplies(comment.id, supabase),
	})

	const { mutate: removeComment } = useMutation({
		mutationFn: () => deleteComment(comment.id, supabase),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['comments', { postId: comment.post_id }],
			})
			queryClient.invalidateQueries({
				queryKey: ['comments', { parentId: comment.parent_id }],
			})
		},
	})

	return (
		<View
			style={{
				backgroundColor: 'white',
				marginTop: 10,
				paddingHorizontal: 10,
				paddingVertical: 5,
				gap: 10,
				borderLeftColor: '#E5E7EB',
				borderLeftWidth: depth > 0 ? 1 : 0,
			}}>
			<Text>{comment.comment}</Text>
			<View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: 14 }}>
				{session?.user.id === comment.user_id && (
					<Entypo
						onPress={() => removeComment()}
						name='trash'
						size={15}
						color='#737373'
					/>
				)}
				<Octicons
					name='reply'
					size={16}
					color='#737373'
					onPress={() => handleReplyButtonPressed(comment.id)}
				/>
				<MaterialCommunityIcons
					name='trophy-outline'
					size={16}
					color='#737373'
				/>
				<View style={{ flexDirection: 'row', gap: 5, alignItems: 'center' }}>
					<MaterialCommunityIcons
						name='arrow-up-bold-outline'
						size={18}
						color='#737373'
					/>
					<Text style={{ fontWeight: '500', color: '#737373' }}>{comment.upvotes}</Text>
					<MaterialCommunityIcons
						name='arrow-down-bold-outline'
						size={18}
						color='#737373'
					/>
				</View>
			</View>

			{!!replies?.length && !showReplies && depth < 5 && (
				<Pressable
					onPress={() => setShowReplies(true)}
					style={{
						backgroundColor: '#EDEDED',
						borderRadius: 2,
						paddingVertical: 3,
						alignItems: 'center',
					}}>
					<Text
						style={{
							fontSize: 12,
							letterSpacing: 0.5,
							fontWeight: '500',
							color: '#545454',
						}}>
						Show Replies
					</Text>
				</Pressable>
			)}

			{showReplies &&
				!!replies?.length &&
				replies.map(item => (
					<CommentListItem
						key={item.id}
						comment={item}
						depth={depth + 1}
						handleReplyButtonPressed={handleReplyButtonPressed}
					/>
				))}
		</View>
	)
}

export default memo(CommentListItem)
