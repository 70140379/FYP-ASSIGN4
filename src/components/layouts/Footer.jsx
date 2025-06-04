import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-green-600 text-white py-8 mt-16">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm">&copy; {new Date().getFullYear()} FYP Finder. All rights reserved.</p>
        <div className="flex space-x-4 mt-4 md:mt-0">
          <a href="https://twitter.com" aria-label="Twitter" className="hover:text-green-300">
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M23 3a10.9 10.9 0 01-3.14.86 4.48 4.48 0 001.96-2.48 9.16 9.16 0 01-2.88 1.1 4.52 4.52 0 00-7.73 4.12A12.82 12.82 0 013 4.16a4.52 4.52 0 001.4 6.04 4.49 4.49 0 01-2.05-.56v.06a4.52 4.52 0 003.62 4.43 4.52 4.52 0 01-2.04.08 4.53 4.53 0 004.21 3.13A9.06 9.06 0 012 19.54 12.83 12.83 0 008.29 21c7.54 0 11.67-6.25 11.67-11.67 0-.18-.01-.36-.02-.54A8.34 8.34 0 0023 3z" />
            </svg>
          </a>
          <a href="https://facebook.com" aria-label="Facebook" className="hover:text-green-300">
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M22 12a10 10 0 10-11.58 9.88v-7h-3v-3h3v-2.3c0-3 1.8-4.7 4.5-4.7 1.3 0 2.7.24 2.7.24v3h-1.5c-1.5 0-2 1-2 2v2.3h3.4l-.5 3h-2.9v7A10 10 0 0022 12z" />
            </svg>
          </a>
          <a href="https://linkedin.com" aria-label="LinkedIn" className="hover:text-green-300">
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M16 8a6 6 0 016 6v6h-4v-6a2 2 0 00-4 0v6h-4v-6a6 6 0 016-6zM2 9h4v12H2zM4 3a2 2 0 110 4 2 2 0 010-4z" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
