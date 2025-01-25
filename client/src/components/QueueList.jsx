import { Button } from "./ui/button"
import React from "react"

const QueueList = ({ queues, onUpdateStatus, onRemove }) => {
  const getStatusColor = status => {
    switch (status) {
      case "waiting":
        return "bg-yellow-100 text-yellow-800"
      case "notified":
        return "bg-blue-100 text-blue-800"
      case "seated":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-4 w-full sm:w-[90%] md:w-[80%] ">
      {queues.map(queue => (
        <div key={queue.id} className="border rounded-lg p-4 shadow-sm bg-white">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-medium">{queue.customerName}</h3>
              <p className="text-sm text-gray-500">Party of {queue.partySize}</p>
              <p className="text-sm text-gray-500">{queue.phoneNumber}</p>
            </div>
            <div className="text-right">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                  queue.status
                )}`}
              >
                {queue.status}
              </span>
              <p className="text-sm text-gray-500 mt-1">Position: {queue.position}</p>
              <p className="text-sm text-gray-500">Wait: ~{queue.estimatedWaitTime} mins</p>
            </div>
          </div>

          <div className="mt-4 flex space-x-2">
            {queue.status === "waiting" && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onUpdateStatus(queue.id, "notified")}
              >
                Notify
              </Button>
            )}
            {queue.status === "notified" && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onUpdateStatus(queue.id, "seated")}
              >
                Seat
              </Button>
            )}
            <Button variant="destructive" size="sm" onClick={() => onRemove(queue.id)}>
              Remove
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default QueueList
