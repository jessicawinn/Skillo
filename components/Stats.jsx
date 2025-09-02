import React from 'react'
import Image from 'next/image';

const Stats = () => {
    return (
        <div className="flex gap-5 p-8">
            {/* Left side */}
            <div className="flex flex-col gap-5 flex-1">
                <div className="bg-gray-100 p-10 rounded h-24 flex items-center justify-start gap-15">
                    <Image
                        src="/Certificate.png"   // Direct path from /public
                        alt="Hero banner"
                        width={50}       // Must provide width
                        height={50}      // Must provide height
                        className="rounded-lg object-cover"
                    />
                    <div>
                        <div>Certificates</div>
                        <div>28</div>
                    </div>
                </div>
                <div className="bg-gray-100 p-10 rounded h-24 flex items-center justify-start gap-15">
                    <Image
                        src="/Courses.png"   // Direct path from /public
                        alt="Hero banner"
                        width={50}       // Must provide width
                        height={50}      // Must provide height
                        className="rounded-lg object-cover"
                    />
                    <div>
                        <div>Courses</div>
                        <div>28</div>
                    </div>
                </div>
            </div>

            {/* Right side */}
            <div className="flex-2">
                <div className="bg-gray-100 p-5 rounded h-56 flex items-center justify-start gap-15">
                    <div className='text-center'>
                        My progress
                    </div>
                    <div>
                        pic
                    </div>
                    <div>
                        <div>UX Design</div>
                        <div>48%</div>
                        <div>UX Design</div>
                        <div>48%</div>
                        <div>UX Design</div>
                        <div>48%</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Stats
