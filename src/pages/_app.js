import '../app/globals.css'
import { Inter } from 'next/font/google'
import { UserProvider } from '@auth0/nextjs-auth0/client';
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGear } from '@fortawesome/free-solid-svg-icons'

export default function MyApp({ Component, pageProps }) {
  const toggleNavBar = () => {
    if (document.getElementById("navbar-default").classList.contains("hidden")) {
        document.getElementById("navbar-default").classList.remove("hidden")
        document.getElementById("navbar-default").classList.add("block")
    } else if (document.getElementById("navbar-default").classList.contains("block")) {
        document.getElementById("navbar-default").classList.remove("block")
        document.getElementById("navbar-default").classList.add("hidden")
    }

  }

  return <UserProvider><main className="flex flex-col min-h-screen items-center p-24"><nav className="justify-between text-lg font-mono bg-white dark:bg-gray-900 fixed w-full z-20 top-0 left-0 border-b border-gray-200 dark:border-gray-600">
  <div onClick={toggleNavBar} className="max-w-screen-xl flex flex-wrap justify-items-end mx-auto p-4">
    <div className="block w-full md:block md:w-auto" id="navbar-default">
      <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
        <li>
          <Link href="/" className="block py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white md:dark:text-blue-500" aria-current="page">Home</Link>
        </li>       
        <li>
          <Link href="/decks" className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">My decks</Link>
        </li>       
        <li>
          <Link href="/settings" className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"> <FontAwesomeIcon icon={faGear} size="1x" /></Link>
        </li>
        <li>
          <Link href="/api/auth/logout" className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Logout</Link>
        </li>       
      </ul>
    </div>
  </div>
</nav>
<Component {...pageProps} /></main></UserProvider>
}


