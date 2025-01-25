import React, { useState } from "react"
import { gql, useMutation, useQuery } from "@apollo/client"

const GET_QUEUE_STATUS = gql`
  query GetQueueStatus {
    getAllQueues {
      position
    }
    getCurrentWaitTime
  }
`

const ADD_TO_QUEUE = gql`
  mutation AddToQueue($customerName: String!, $phoneNumber: String!, $partySize: Int!) {
    addToQueue(customerName: $customerName, phoneNumber: $phoneNumber, partySize: $partySize) {
      id
      position
      estimatedWaitTime
    }
  }
`

const ClientView = () => {
  const { loading, error, data, refetch } = useQuery(GET_QUEUE_STATUS, {
    pollInterval: 5000, // Poll every 5 seconds for updates
  })

  const [addToQueue] = useMutation(ADD_TO_QUEUE)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    customerName: "",
    phoneNumber: "",
    partySize: 1,
  })
  const [submissionResult, setSubmissionResult] = useState(null)

  if (loading) return <div className="text-center p-8">Loading...</div>
  if (error) return <div className="text-center p-8 text-red-500">Error: {error.message}</div>

  const queueCount = data?.getAllQueues?.length || 0
  const estimatedWaitTime = data?.getCurrentWaitTime || 0

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      const result = await addToQueue({
        variables: {
          ...formData,
          partySize: parseInt(formData.partySize),
        },
      })
      setSubmissionResult({
        success: true,
        position: result.data.addToQueue.position,
        waitTime: result.data.addToQueue.estimatedWaitTime,
      })
      refetch()
    } catch (error) {
      setSubmissionResult({
        success: false,
        message: error.message,
      })
    }
    setShowForm(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Status Display */}
          <div className="p-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Current Queue Status</h2>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-blue-50 p-6 rounded-lg">
                <p className="text-4xl font-bold text-blue-600 mb-2">{queueCount}</p>
                <p className="text-sm text-blue-600">People in Queue</p>
              </div>
              <div className="bg-green-50 p-6 rounded-lg">
                <p className="text-4xl font-bold text-green-600 mb-2">{estimatedWaitTime}</p>
                <p className="text-sm text-green-600">Minutes Wait</p>
              </div>
            </div>
          </div>

          {/* Submission Result */}
          {submissionResult && (
            <div className={`p-4 ${submissionResult.success ? "bg-green-50" : "bg-red-50"}`}>
              {submissionResult.success ? (
                <div className="text-center text-green-700">
                  <p className="font-semibold">Successfully joined queue!</p>
                  <p>Your position: {submissionResult.position}</p>
                  <p>Estimated wait: {submissionResult.waitTime} minutes</p>
                </div>
              ) : (
                <div className="text-center text-red-700">
                  <p>Error: {submissionResult.message}</p>
                </div>
              )}
            </div>
          )}

          {/* Join Queue Button or Form */}
          <div className="p-8 bg-gray-50 border-t border-gray-200">
            {!showForm ? (
              <button
                onClick={() => setShowForm(true)}
                className="w-full bg-primary text-white py-3 px-4 rounded-md hover:bg-primary/90 transition-colors"
              >
                Join Queue
              </button>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={formData.customerName}
                    onChange={e => setFormData({ ...formData, customerName: e.target.value })}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Party Size</label>
                  <select
                    value={formData.partySize}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        partySize: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  >
                    {[...Array(12)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1} {i === 0 ? "person" : "people"}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="flex-1 bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 transition-colors"
                  >
                    Submit
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ClientView
