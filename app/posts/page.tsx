import PostList from '../components/posts/PostList'
import { View, Text } from 'lucide-react-native'


export default function PostsPage() {
  return (
    <View style={{ }}>
      <PostList initialMode='all'/>
    </View>
  )
}
