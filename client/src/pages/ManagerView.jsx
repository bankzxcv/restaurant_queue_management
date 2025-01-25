import React, { useEffect } from "react"
import { gql, useMutation, useQuery } from "@apollo/client"

import QueueForm from "../components/QueueForm"
import QueueList from "../components/QueueList"

const GET_ALL_QUEUES = gql`
  query GetAllQueues {
    getAllQueues {
      id
      customerName
      phoneNumber
      partySize
      status
      position
      estimatedWaitTime
      createdAt
    }
  }
`

const ADD_TO_QUEUE = gql`
  mutation AddToQueue($customerName: String!, $phoneNumber: String!, $partySize: Int!) {
    addToQueue(customerName: $customerName, phoneNumber: $phoneNumber, partySize: $partySize) {
      id
      customerName
      phoneNumber
      partySize
      status
      position
      estimatedWaitTime
      createdAt
    }
  }
`

const UPDATE_QUEUE_STATUS = gql`
  mutation UpdateQueueStatus($id: ID!, $status: String!) {
    updateQueueStatus(id: $id, status: $status) {
      id
      status
    }
  }
`

const REMOVE_FROM_QUEUE = gql`
  mutation RemoveFromQueue($id: ID!) {
    removeFromQueue(id: $id) {
      id
    }
  }
`

function ManagerView() {
  const { loading, error, data, refetch } = useQuery(GET_ALL_QUEUES)
  const [addToQueue] = useMutation(ADD_TO_QUEUE)
  const [updateQueueStatus] = useMutation(UPDATE_QUEUE_STATUS)
  const [removeFromQueue] = useMutation(REMOVE_FROM_QUEUE)

  // WebSocket setup
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:4000/graphql")

    ws.onopen = () => {
      console.log("WebSocket connected")
    }

    ws.onmessage = event => {
      const data = JSON.parse(event.data)
      if (data.type === "QUEUE_UPDATED") {
        refetch()
      }
    }

    ws.onerror = error => {
      console.error("WebSocket error:", error)
    }

    return () => {
      ws.close()
    }
  }, [refetch])

  const handleSubmit = async formData => {
    try {
      await addToQueue({
        variables: formData,
      })
      refetch()
    } catch (error) {
      console.error("Error adding to queue:", error)
    }
  }

  const handleUpdateStatus = async (id, status) => {
    try {
      await updateQueueStatus({
        variables: { id, status },
      })
      refetch()
    } catch (error) {
      console.error("Error updating status:", error)
    }
  }

  const handleRemove = async id => {
    try {
      await removeFromQueue({
        variables: { id },
      })
      refetch()
    } catch (error) {
      console.error("Error removing from queue:", error)
    }
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div className="w-full min-h-screen bg-gray-50 w-screen flex flex-col justify-between items-center">
      <header className="bg-white shadow sticky top-0 z-10 w-full">
        <div className="w-full px-4 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center sm:text-left">
              Restaurant Queue Manager
            </h1>
            <button
              onClick={() => {
                const url = window.location.origin
                const qrCode = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${url}`
                window.open(qrCode, "_blank")
              }}
              className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors whitespace-nowrap"
            >
              Generate QR Code
            </button>
          </div>
        </div>
      </header>
      <main className="flex-1 w-full">
        <div className="h-full p-4">
          <div className="flex flex-col sm:flex-row gap-8">
            <div className="w-[100%]">
              <h2 className="text-xl sm:text-2xl font-bold mb-4">Add to Queue</h2>
              <QueueForm onSubmit={handleSubmit} />
            </div>
            <div className="w-[100%]">
              <h2 className="text-xl sm:text-2xl font-bold mb-4">Current Queue</h2>
              <div className="max-h-[calc(100vh-300px)] overflow-y-auto w-full sm:w-[90%] md:w-[80%]">
                <QueueList
                  queues={data.getAllQueues}
                  onUpdateStatus={handleUpdateStatus}
                  onRemove={handleRemove}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default ManagerView
