import { fetchJobApplicationCandidate, fetchJobsForCandidateAction } from '@/actions'
import CandidateActivity from '@/components/candidate-activity'
import { currentUser } from '@clerk/nextjs/server'
import React from 'react'

async function Activity() {
    const user = await currentUser()
    const jobList = await fetchJobsForCandidateAction()
    const jobApplicants = await fetchJobApplicationCandidate(user?.id)

    return (
        <CandidateActivity jobList={jobList} jobApplicants={jobApplicants} />
    )
}

export default Activity