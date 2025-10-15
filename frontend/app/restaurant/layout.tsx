import React from 'react'
import Navbar from '@/components/Navbar/Navbar'

const layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div>
            <div className="sticky top-0 z-50 bg-white shadow ">
                <Navbar />
            </div>
            {children}
        </div>
    )
}

export default layout