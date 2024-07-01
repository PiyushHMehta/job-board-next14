'use client'

import { Fragment, useState } from "react"
import CommonCard from "../common-card"
import JobIcon from "../job-icon"
import { Button } from "../ui/button"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer"
import { createJobApplicationAction } from "@/actions"

function CandidateJobCard({ jobItem, profileInfo, jobApplications }) {
    const [showJobDetailsDrawer, setShowJobDetailsDrawer] = useState(false)

    async function handleJobApply() {
        await createJobApplicationAction({
            recruiterUserId: jobItem?.recruiterId,
            name: profileInfo?.candidateInfo?.name,
            email: profileInfo?.candidateInfo?.email,
            candidateUserId: profileInfo.userId,
            status: ['Applied'],
            jobId: jobItem?._id,    // from mongodb
            jobAppliedDate: new Date().toLocaleDateString()
        }, '/jobs')
        setShowJobDetailsDrawer(false)
    }


    return (
        <Fragment>
            <Drawer open={showJobDetailsDrawer} onOpenChange={setShowJobDetailsDrawer}>
                <CommonCard
                    icon={<JobIcon />}
                    title={jobItem?.title}
                    description={jobItem?.companyName}
                    footerContent={
                        <Button onClick={() => setShowJobDetailsDrawer(true)} className='flex h-11 items-center justify-center px-5'>
                            View Details
                        </Button>
                    }
                />
                <DrawerContent className='p-6'>
                    <DrawerHeader className='px-0'>
                        <div className="flex justify-between ">
                            <DrawerTitle className='text-4xl font-extrabold text-gray-800'>
                                {jobItem?.title}
                            </DrawerTitle>
                            <div className="flex gap-3">
                                <Button
                                    onClick={handleJobApply}
                                    disabled={
                                        jobApplications.findIndex(item => item?.jobId === jobItem?._id) > -1 ? true : false
                                    }
                                    className='flex h-11 items-center justify-center px-5 disabled:opacity-65'>
                                    {
                                        jobApplications.findIndex(item => item?.jobId === jobItem?._id) > -1 ? 'Applied' : 'Apply'}
                                </Button>
                                <Button onClick={() => setShowJobDetailsDrawer(false)}
                                    disabled={
                                        jobApplications.findIndex(item => item?.jobId === jobItem?._id) > -1 ? false : true
                                    }
                                    className='flex h-11 items-center justify-center px-5 disabled:opacity-65'>
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </DrawerHeader>
                    <DrawerDescription className='text-2xl font-medium text-gray-600'>
                        {jobItem?.description}
                        <span className="text-xl font-normal text-gray-500 ml-4">{jobItem?.location}</span>
                    </DrawerDescription>
                    <div className="w-[150px] flex justify-center items-center h-[40px] bg-black rounded-[4px] mt-6">
                        <h2 className="text-xl font-black text-white">
                            {jobItem?.type}
                        </h2>
                    </div>
                    <h3 className="text-2xl font-medium text-black mt-3">
                        {jobItem?.experience}
                    </h3>
                    <div className="flex gap-4 mt-6">
                        {
                            jobItem?.skills.split(',').map(skill => (
                                <div className="w-[100px] flex justify-center items-center h-[35px] bg-black rounded-[4px]">
                                    <h2 className="text-[13px] font-medium text-white">{skill}</h2>
                                </div>
                            ))
                        }
                    </div>
                </DrawerContent>
            </Drawer>
        </Fragment >
    )
}

export default CandidateJobCard