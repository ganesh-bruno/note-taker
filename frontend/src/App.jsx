import SimpleForm from './components/SimpleForm'
import SubmissionsList from './components/SubmissionsList'
import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          My Fullstack Application
        </h1>
        
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/2">
            <SimpleForm />
          </div>
          <div className="md:w-1/2">
            <SubmissionsList />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
