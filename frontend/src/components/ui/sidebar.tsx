"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "./button"

type IncomeData = {
  income: number
  tax: number
  cess: number
  totalTax: number
}

const ExpandableItem = ({ data }: { data: IncomeData }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <Button
        className="w-full px-4 py-2 text-left flex justify-between items-center hover:bg-gray-100"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span >Income: ₹{data.income.toLocaleString()}</span>
        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </Button>
      {isExpanded && (
        <div className="px-4 py-2 bg-gray-50">
          <p>Tax: ₹{data.tax.toLocaleString()}</p>
          <p>Cess: ₹{data.cess.toLocaleString()}</p>
          <p>Total Tax: ₹{data.totalTax.toLocaleString()}</p>
        </div>
      )}
    </div>
  )
}

const Sidebar = ({ data }: { data: IncomeData[] }) => {
  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 overflow-y-auto">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold">History</h2>
      </div>
      {data.map((item, index) => (
        <ExpandableItem key={index} data={item} />
      ))}
    </div>
  )
}

export default Sidebar

