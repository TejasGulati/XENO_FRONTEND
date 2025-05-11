import { 
    SignedIn, 
    SignedOut, 
    SignInButton, 
    UserButton,
    useUser 
  } from '@clerk/clerk-react'
  
  const Auth = () => {
    const { user } = useUser()
  
    return (
      <div className="flex items-center gap-4">
        <SignedOut>
          <SignInButton mode="modal">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Sign In
            </button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">
              {user?.fullName || user?.primaryEmailAddress?.emailAddress}
            </span>
            <UserButton afterSignOutUrl="/" />
          </div>
        </SignedIn>
      </div>
    )
  }
  
  export default Auth