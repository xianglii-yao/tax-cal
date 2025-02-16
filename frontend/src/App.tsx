"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import  Sidebar  from "@/components/ui/sidebar"

type TaxResults = {
  income: number
  tax: number
  cess: number
  totalTax: number
}

export default function App() {
  const [formData, setFormData] = useState({
    name:"",
    annualIncome: "",
    investments: "",
    otherDeductions: "",
    otherIncome: "",
  })
  const [results, setResults] = useState<TaxResults | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [history,sethisory] = useState<TaxResults[] | undefined>()
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }
  const name = localStorage.getItem("name")

  const calculateTax = async () => {
    setIsLoading(true)
    try {
      const totalIncome = 
        (Number.parseFloat(formData.annualIncome) || 0) + 
        (Number.parseFloat(formData.otherIncome) || 0 ) - 
        (Number.parseFloat(formData.investments) || 0 ) - 
        (Number.parseFloat(formData.otherDeductions) || 0)
      
      // Hit the API endpoint
      const response = await fetch("https://tax-cal-1t5p.onrender.com/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          income: totalIncome,
          name: formData.name
        }),
      })
      localStorage.setItem("name",formData.name);
      if (!response.ok) {
        throw new Error("Failed to calculate tax")
      }

      const data: TaxResults = await response.json();
      setResults(data)
    } catch (error) {
      console.error("Error calculating tax:", error)
      // You might want to show an error message to the user here
    } finally {
      setIsLoading(false)
    }
  }
  useEffect( ()=>{
    if(name){
    async function fetchdata(){
      
      
      const response = await fetch("https://tax-cal-1t5p.onrender.com/history", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name
        }),
      })
      if (!response.ok) {
        throw new Error("Failed to calculate tax")
      }
  
      const data: TaxResults[] = await response.json();
      sethisory(data)
    }
    fetchdata();
  }
    
  },[name])
  return (
    <div className="container w-[100vw] flex justify-center mx-auto p-4">
      {history ? (<Sidebar data={history}></Sidebar>) : ""}
      <Card className=" max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Indian Tax Calculator</CardTitle>
          <CardDescription>Enter your financial details to calculate your tax liability</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
          <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                type="string"
                placeholder="Enter your name"
                value={formData.name }
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="annualIncome">Annual Income (₹)</Label>
              <Input
                id="annualIncome"
                name="annualIncome"
                type="number"
                placeholder="Enter your annual income"
                value={formData.annualIncome}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="investments">Investments (80C, 80D, etc.) (₹)</Label>
              <Input
                id="investments"
                name="investments"
                type="number"
                placeholder="Enter your investments"
                value={formData.investments}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="otherDeductions">Other Deductions (HRA, LTA, etc.) (₹)</Label>
              <Input
                id="otherDeductions"
                name="otherDeductions"
                type="number"
                placeholder="Enter other deductions"
                value={formData.otherDeductions}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="otherIncome">Income from Other Sources (₹)</Label>
              <Input
                id="otherIncome"
                name="otherIncome"
                type="number"
                placeholder="Enter income from other sources"
                value={formData.otherIncome}
                onChange={handleInputChange}
              />
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button onClick={calculateTax} disabled={isLoading} className="w-full">
            {isLoading ? "Calculating..." : "Calculate Tax"}
          </Button>
        </CardFooter>
      </Card>

      {results && (
        <Card className="w-full max-w-2xl mx-auto mt-8">
          <CardHeader>
            <CardTitle>Tax Calculation Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>
                <strong>Income:</strong> ₹{results.income.toFixed(2)}
              </p>
              <p>
                <strong>Tax:</strong> ₹{results.tax.toFixed(2)}
              </p>
              <p>
                <strong>Cess:</strong> ₹{results.cess.toFixed(2)}
              </p>
              <p>
                <strong>Total Tax Payable:</strong> ₹{results.totalTax.toFixed(2)}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}