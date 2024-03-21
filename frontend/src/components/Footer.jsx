import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return  (


<footer className=" left-0 z-20 w-full p-4 bg-grey-600  shadow md:flex md:items-center md:justify-between md:p-6 dark:bg-white dark:border-gray-600">
    <span className="text-sm  sm:text-center  text-gray-500 dark:text-black-400">© 2024 <a href="http://localhost:3000/" className="hover:underline hover:text-green-500">MeroJagir™</a>. All Rights Reserved.
    </span>
    <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-black-400 sm:mt-0">
    <li>
            <Link to={"/jobs"} className="hover:underline hover:text-green-500 me-4 md:me-6">Jobs</Link>
        </li>
        <li>
            <Link to={"/about"} className="hover:underline hover:text-green-500 me-4 md:me-6">About</Link>
        </li>
        <li>
            <Link to={"/privacypolicy"} className="hover:underline hover:text-green-500 me-4 md:me-6">Privacy Policy</Link>
        </li>
        <li>
            <Link to={"/contact"} className="hover:underline hover:text-green-500">Contact</Link>
        </li>
    </ul>
</footer>

  )
}

export default Footer
