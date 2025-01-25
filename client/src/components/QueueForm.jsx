import React, { useState } from "react"

import { Button } from "./ui/button"

const QueueForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    customerName: "",
    phoneNumber: "",
    partySize: 1,
  })

  const handleSubmit = e => {
    e.preventDefault()
    onSubmit(formData)
    setFormData({ customerName: "", phoneNumber: "", partySize: 1 })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white rounded-lg shadow-md">
      <div>
        <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-1">
          Name
        </label>
        <input
          type="text"
          id="customerName"
          value={formData.customerName}
          onChange={e => setFormData({ ...formData, customerName: e.target.value })}
          className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
          required
          placeholder="Enter customer name"
        />
      </div>

      <div>
        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
          Phone Number
        </label>
        <input
          type="tel"
          id="phoneNumber"
          value={formData.phoneNumber}
          onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })}
          className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
          required
          placeholder="Enter phone number"
        />
      </div>

      <div>
        <label htmlFor="partySize" className="block text-sm font-medium text-gray-700 mb-1">
          Party Size
        </label>
        <select
          id="partySize"
          value={formData.partySize}
          onChange={e => setFormData({ ...formData, partySize: parseInt(e.target.value) })}
          className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
          required
        >
          {[...Array(12)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1} {i === 0 ? 'person' : 'people'}
            </option>
          ))}
        </select>
      </div>

      <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white">
        Join Queue
      </Button>
    </form>
  )
}

export default QueueForm
