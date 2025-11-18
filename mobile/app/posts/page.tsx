import React from 'react'
import PostList from '../components/posts/PostList'
import { View, Text } from 'lucide-react-native'


export default function PostsPage() {
  return (
    <View style={{ padding: 16 }}>
      <Text>Posts</Text>
      <PostList initialMode='all'/>
    </View>
  )
}
