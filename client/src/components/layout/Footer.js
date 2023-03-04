import React from 'react'

export default function Footer() {
  return (
    <div>
      <footer className='bg-dark text-white p-4 text-center'>
        Copyright &copy; {new Date().getFullYear()} DevConnector
      </footer> 
    </div>
  )
}
