import { createFilterCategoryACtion, fetchJobApplicationCandidate, fetchJobApplicationRecruiter, fetchJobsForCandidateAction, fetchJobsForRecruiterAction, fetchProfileAction } from '@/actions'
import JobListing from '@/components/job-listing'
import { currentUser } from '@clerk/nextjs/server'
import React from 'react'

async function JobsPage({ searchParams }) {
    // console.log(searchParams);
    const user = await currentUser()
    const profileInfo = await fetchProfileAction(user?.id)

    const jobList = profileInfo?.role === 'recruiter'
        ? await fetchJobsForRecruiterAction(user?.id)
        : await fetchJobsForCandidateAction(searchParams)
    // console.log(jobList);

    const getJobApplicationList = profileInfo?.role === 'candidate'
        ? await fetchJobApplicationCandidate(user?.id)
        : await fetchJobApplicationRecruiter(user?.id)

    const fetchFilterCategories = await createFilterCategoryACtion()

    return (
        <JobListing
            user={JSON.parse(JSON.stringify(user))}
            profileInfo={profileInfo}
            jobList={jobList}
            jobApplications={getJobApplicationList}
            filterCategories={fetchFilterCategories}
        />
    )
}

export default JobsPage