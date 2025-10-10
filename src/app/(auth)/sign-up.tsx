import * as React from 'react'
import {
	Button,
	KeyboardAvoidingView,
	Platform,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native'
import { useSignUp } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'

export default function SignUpScreen() {
	const { isLoaded, signUp, setActive } = useSignUp()
	const router = useRouter()

	const [emailAddress, setEmailAddress] = React.useState('')
	const [username, setUsername] = React.useState('')
	const [password, setPassword] = React.useState('')
	const [pendingVerification, setPendingVerification] = React.useState(false)
	const [code, setCode] = React.useState('')

	const onSignUpPress = async () => {
		if (!isLoaded) return

		try {
			await signUp.create({
				emailAddress,
				password,
			})

			await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

			setPendingVerification(true)
		} catch (err) {
			console.error(JSON.stringify(err, null, 2))
		}
	}

	const onVerifyPress = async () => {
		if (!isLoaded) return

		try {
			const signUpAttempt = await signUp.attemptEmailAddressVerification({
				code,
			})

			if (signUpAttempt.status === 'complete') {
				await setActive({ session: signUpAttempt.createdSessionId })
				router.replace('/')
			} else {
				console.error(JSON.stringify(signUpAttempt, null, 2))
			}
		} catch (err) {
			console.error(JSON.stringify(err, null, 2))
		}
	}

	if (pendingVerification) {
		return (
			<KeyboardAvoidingView
				style={styles.container}
				behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
				<Text style={styles.title}>Verify Your Email</Text>
				<TextInput
					style={styles.input}
					value={code}
					placeholder='Enter your verification code'
					placeholderTextColor='#aaa'
					onChangeText={setCode}
				/>
				<Button
					title='Verify'
					onPress={onVerifyPress}
				/>
			</KeyboardAvoidingView>
		)
	}

	return (
		// <View>
		// 	<>
		// 		<Text>Sign up</Text>
		// 		<TextInput
		// 			autoCapitalize='none'
		// 			value={emailAddress}
		// 			placeholder='Enter email'
		// 			onChangeText={email => setEmailAddress(email)}
		// 		/>
		// 		<TextInput
		// 			value={password}
		// 			placeholder='Enter password'
		// 			secureTextEntry={true}
		// 			onChangeText={password => setPassword(password)}
		// 		/>
		// 		<TouchableOpacity onPress={onSignUpPress}>
		// 			<Text>Continue</Text>
		// 		</TouchableOpacity>
		// 		<View style={{ display: 'flex', flexDirection: 'row', gap: 3 }}>
		// 			<Text>Already have an account?</Text>
		// 			<Link href='/sign-in'>
		// 				<Text>Sign in</Text>
		// 			</Link>
		// 		</View>
		// 	</>
		// </View>

		<KeyboardAvoidingView
			style={styles.container}
			behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
			<Text style={styles.title}>Sign Up</Text>
			<TextInput
				style={styles.input}
				autoCapitalize='none'
				value={emailAddress}
				placeholder='Enter email'
				placeholderTextColor='#aaa'
				onChangeText={setEmailAddress}
			/>
			<TextInput
				style={styles.input}
				autoCapitalize='none'
				value={username}
				placeholder='Username'
				placeholderTextColor='#aaa'
				onChangeText={setUsername}
			/>
			<TextInput
				style={styles.input}
				value={password}
				placeholder='Enter password'
				placeholderTextColor='#aaa'
				secureTextEntry
				onChangeText={setPassword}
			/>
			<Button
				title='Continue'
				onPress={onSignUpPress}
			/>
			<View style={styles.signInContainer}>
				<Text style={styles.text}>Already have an account?</Text>
				<Link
					href='/sign-in'
					asChild>
					<TouchableOpacity>
						<Text style={styles.signInText}> Sign in</Text>
					</TouchableOpacity>
				</Link>
			</View>
		</KeyboardAvoidingView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 20,
		backgroundColor: '#f8f9fa',
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		marginBottom: 20,
		color: 'black',
	},
	input: {
		width: '100%',
		height: 50,
		borderWidth: 1,
		borderColor: 'lightgrey',
		borderRadius: 10,
		paddingHorizontal: 10,
		marginBottom: 15,
		backgroundColor: 'white',
	},
	signInContainer: {
		flexDirection: 'row',
		marginTop: 15,
	},
	text: {
		fontSize: 16,
		color: 'grey',
	},
	signInText: {
		fontSize: 16,
		color: '#007bff',
		fontWeight: 'bold',
	},
})
