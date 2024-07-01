// server action

'use server'

import connectToDB from "@/database"
import Application from "@/models/application"
import Job from "@/models/job"
import Profile from "@/models/profile"
import { revalidatePath } from "next/cache"

// create profile action
export async function createProfileAction(formData, pathToRevalidate) {
    await connectToDB()
    await Profile.create(formData)
    revalidatePath(pathToRevalidate)
}


// get profile of currently logged in user
export async function fetchProfileAction(id) {
    await connectToDB()
    const result = await Profile.findOne({ userId: id })
    return JSON.parse(JSON.stringify(result))
}

// create job
export async function postNewJobAction(formData, pathToRevalidate) {
    await connectToDB()
    await Job.create(formData)
    revalidatePath(pathToRevalidate)
}


// fetch jobs
export async function fetchJobsForRecruiterAction(id) {
    await connectToDB()
    const result = await Job.find({ recruiterId: id })
    return JSON.parse(JSON.stringify(result))
}
// here all jobs created by the recruiter will be visible to him/her

export async function fetchJobsForCandidateAction(filterParams = {}) {
    await connectToDB()
    let updatedParams = {}
    Object.keys(filterParams).forEach(filterKey => {
        updatedParams[filterKey] = { $in: filterParams[filterKey].split(',') }
    })
    const result = await Job.find(filterParams && Object.keys(filterParams).length > 0 ? updatedParams : {})
    return JSON.parse(JSON.stringify(result))
}

// create job application
export async function createJobApplicationAction(data, pathToRevalidate) {
    await connectToDB()
    await Application.create(data)
    revalidatePath(pathToRevalidate)
}

// fetch job application
// candidate
export async function fetchJobApplicationCandidate(candidateID) {
    await connectToDB()
    const result = await Application.find({ candidateUserId: candidateID })
    return JSON.parse(JSON.stringify(result))
}
// recruiter
export async function fetchJobApplicationRecruiter(recruiterID) {
    await connectToDB()
    const result = await Application.find({ recruiterUserId: recruiterID })
    return JSON.parse(JSON.stringify(result))
}
// here those jobs will be displayed for recruiter on which candidates have applied

// update job application
export async function updateJobApplicationAction(data, pathToRevalidate) {
    await connectToDB()
    const { recruiterUserId, name, email, candidateUserId, status, jobId, _id, jobAppliedDate } = data
    await Application.findOneAndUpdate({ _id }, {
        recruiterUserId,
        name,
        email,
        candidateUserId,
        status,
        jobId,
        jobAppliedDate
    }, {
        new: true
    })
    revalidatePath(pathToRevalidate)
}

// get candidate details by id
export async function getCandidateDetailsByIdAction(currentCandidateId) {
    await connectToDB()
    const result = await Profile.findOne({ userId: currentCandidateId })
    return JSON.parse(JSON.stringify(result))
}

// create filter categories
export async function createFilterCategoryACtion() {
    await connectToDB()
    const result = await Job.find({})
    return JSON.parse(JSON.stringify(result))
}

// update profile action
export async function updateProfileAction(data, pathToRevalidate) {
    await connectToDB()
    const { userId, role, email, isPremiumUser, membershipType, membershipStartDate, membershipEndDate, recruiterInfo, candidateInfo, _id } = data;

    await Profile.findOneAndUpdate({_id}, {
        userId, role, email, isPremiumUser, membershipType, membershipStartDate, membershipEndDate, recruiterInfo, candidateInfo
    }, {
        new: true
    })
    revalidatePath(pathToRevalidate)
}