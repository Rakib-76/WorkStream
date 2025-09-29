import React from 'react'

export default function Overview() {
  return (
   <div className="space-y-4">
    <div ><h2 className="text-2xl font-semibold">Overview</h2></div>
             <div className="bg-card border border-border rounded-xl p-6 shadow-lg">
              <h1 className="text-2xl font-bold mb-4">date</h1>
              <p className="text-muted-foreground">
                This is the <span className="font-medium">Name</span> section.
                Replace with your own project data.
              </p>
            </div>
          </div>
  )
}
