import { Header } from '../components/Header'

export default function NotFound() {
  return (
    <div>
      <Header showMenu={false} />
      <div className="flex flex-col h-screen items-center justify-center">
        <div className="flex items-center justify-center mb-16  mr-8">
          <h1 className="pr-4 py-2 border-r-2 text-2xl">404</h1>
          <h2 className="pl-4 text-md">This page could not be found.</h2>
        </div>
      </div>
    </div>
  )
}
