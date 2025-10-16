import { auth } from "@/auth";
import AuthButton from "@/components/AuthButton";

export default async function Home() {
  const session = await auth();
  const isAuthenticated = !!session?.user;
  const userName = session?.user?.name;
  const userEmail = session?.user?.email;

  return (
    <div className="font-sans grid grid-rows-[80px_1fr_60px] items-center justify-items-center min-h-screen p-8 pb-20 gap-8 sm:p-20">
      <header className="row-start-1 w-full flex justify-end">
        <AuthButton isAuthenticated={isAuthenticated} userName={userName} />
      </header>

      <main className="flex flex-col gap-8 row-start-2 items-center justify-center text-center">
        <h1 className="text-4xl font-bold">
          {isAuthenticated ? `Welcome, ${userName}!` : "Welcome to Dummy Tool 1"}
        </h1>
        
        {isAuthenticated ? (
          <div className="flex flex-col gap-4 p-6 rounded-lg border border-solid border-black/[.08] dark:border-white/[.145] bg-white/[.05] dark:bg-black/[.05]">
            <h2 className="text-2xl font-semibold">User Information</h2>
            <div className="text-left space-y-2">
              <p className="text-lg">
                <span className="font-semibold">Name:</span> {userName || "N/A"}
              </p>
              <p className="text-lg">
                <span className="font-semibold">Email:</span> {userEmail || "N/A"}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4 items-center">
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Please sign in to access the application
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              You will be authenticated using Keycloak
            </p>
          </div>
        )}
      </main>

      <footer className="row-start-3 text-sm text-gray-500">
        <p>Secured with Keycloak Authentication</p>
      </footer>
    </div>
  );
}
