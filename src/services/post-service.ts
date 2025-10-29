import { SupabaseClient } from '@supabase/supabase-js'
import { Database, TablesInsert } from '../types/database.types'

export const fetchPosts = async (supabase: SupabaseClient<Database>) => {
	const { data, error } = await supabase
		.from('posts')
		.select('*, group:groups(*)')
		.order('created_at', { ascending: false })

	if (error) {
		throw error
	} else {
		return data
	}
}

export const fetchPostById = async (id: string, supabase: SupabaseClient<Database>) => {
	const { data, error } = await supabase
		.from('posts')
		.select('*, group:groups(*), upvotes(value.sum()), nr_of_comments:comments(count)')
		.eq('id', id)
		.single()

	if (error) {
		throw error
	} else {
		return data
	}
}

type InsertPost = TablesInsert<'posts'>

export const insertPost = async (post: InsertPost, supabase: SupabaseClient<Database>) => {
	const { data, error } = await supabase.from('posts').insert(post).select().single()

	if (error) {
		throw error
	} else {
		return data
	}
}

export const deletePostById = async (id: string, supabase: SupabaseClient<Database>) => {
	const { data, error } = await supabase.from('posts').delete().eq('id', id)
	if (error) {
		throw error
	} else {
		return data
	}
}
