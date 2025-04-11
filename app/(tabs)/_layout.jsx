import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';


export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarStyle: {
                    backgroundColor: 'white',
                    borderTopWidth: 3,
                    borderTopColor: 'black',
                    height: 60,
                    paddingBottom: 8,
                    
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: 'bold',
                    
                },
                headerStyle: {
                    backgroundColor: '#FFE5E5',
                    borderBottomWidth: 3,
                    borderBottomColor: '#000',
                    height: 100,
                    
                },
                headerTitleStyle: {
                    fontSize: 24,
                    fontWeight: 'bold',
                    color: 'green',
                },
                headerShown:false
            }}
        >
            <Tabs.Screen name="EarningsScreen" options={{
                title: 'Home', tabBarIcon: ({ color, size }) => (
                    <Ionicons name="home" size={size} color={color} />
                )
            }} />
            <Tabs.Screen name="HealthScreen" options={{
                title: ' Health', tabBarIcon: ({ color, size }) => (
                    <Ionicons name="medkit-outline" size={size} color={color} />
                )
            }} />
            <Tabs.Screen name="CommunityScreen" options={{
                title: ' Community', tabBarIcon: ({ color, size }) => (
                    <Ionicons name="chatbubble-ellipses-outline" size={size} color={color} />
                )
            }} />
            <Tabs.Screen name="LearnScreen" options={{
                title: ' Learn', tabBarIcon: ({ color, size }) => (
                    <Ionicons name="document-text-outline" size={size} color={color} />
                )
            }} />
            <Tabs.Screen name="SafetyScreen" options={{
                title: ' Safety', tabBarIcon: ({ color, size }) => (
                    <Ionicons name="lock-closed-outline" size={size} color={color} />
                )
            }} />
        </Tabs>
    );
}
