'use client'

import { useState } from "react"
import CommonCard from "../common-card"
import JobIcon from "../job-icon"
import { Button } from "../ui/button"
import JobApplicants from "../job-applicants"

function RecruiterJobCard({ jobItem, jobApplications }) {

    const [showApplicantsDrawer, setShowApplicantsDrawer] = useState(false)
    const [currentCandidateDetails, setCurrentCandidateDetails] = useState(null)
    const [showCurrentCandidateDetailsModal, setShowCurrentCandidateDetailsModal] = useState(false)

    const filteredJobApplications = jobApplications.filter(item => item?.jobId === jobItem?._id)

    return (
        <div>
            <CommonCard
                icon={<JobIcon />}
                title={jobItem?.title}
                footerContent={
                    <Button
                        onClick={() => setShowApplicantsDrawer(true)}
                        disabled={filteredJobApplications.length === 0}
                        className='flex h-11 items-center justify-center px-5 disabled:opacity-55'
                        >
                        {filteredJobApplications.length} Applicant(s)
                    </Button>
                }
            />
            <JobApplicants
                showApplicantsDrawer={showApplicantsDrawer}
                setShowApplicantsDrawer={setShowApplicantsDrawer}
                showCurrentCandidateDetailsModal={showCurrentCandidateDetailsModal} setShowCurrentCandidateDetailsModal={setShowCurrentCandidateDetailsModal} currentCandidateDetails={currentCandidateDetails}
                setCurrentCandidateDetails={setCurrentCandidateDetails}
                jobItem={jobItem}
                JobApplicants={filteredJobApplications}
            />
        </div>
    )
}

export default RecruiterJobCard