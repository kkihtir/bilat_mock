import LoginForm from "@/components/auth/login-form"

export default function Home() {
  // In a real app, we would check for authentication here
  // For demo purposes, we'll just show the login page
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="w-full max-w-md space-y-8 p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold dark:text-white">Staff Portal</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">Sign in to access your dashboard</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}

