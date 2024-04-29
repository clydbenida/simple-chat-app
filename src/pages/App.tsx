import { Form, Link } from 'react-router-dom'

function App() {

  return (
    <div className="flex justify-center items-center h-screen">
      <Form className="flex flex-col items-center" method="post" action="chat" >
        <input type="text" placeholder="Enter username" name="username" className="mb-2 bg-white border border-gray-200 rounded-md p-2" />
        <button type="submit" className="bg-sky-200 py-2 px-3 rounded-lg" >Welcome!</button>
      </Form>
    </div>
  )
}

export default App
