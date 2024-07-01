'use client'

import { candidateOnboardFormControls, initialCandidateAccountFormData, initialRecruiterFormData, recruiterOnboardFormControls } from "@/utils"
import { useEffect, useState } from "react"
import CommonForm from "../common-form"
import { updateProfileAction } from "@/actions"

function AccountInfo({ profileInfo }) {

    const [candidateFormData, setCandidateFormData] = useState(initialCandidateAccountFormData)
    const [recruiterFormData, setRecruiterFormData] = useState(initialRecruiterFormData)

    useEffect(() => {
        if (profileInfo?.role === 'recruiter') setRecruiterFormData(profileInfo?.recruiterInfo)
        if (profileInfo?.role === 'candidate') setCandidateFormData(profileInfo?.candidateInfo)
    }, [profileInfo])

    // console.log(candidateFormData);


    async function handleUpdateAccount() {
        await updateProfileAction(profileInfo?.role === 'candidate'
            ? {
                _id: profileInfo?._id,
                userId: profileInfo?.userId,
                role: profileInfo?.role,
                email: profileInfo?.email,
                isPremiumUser: profileInfo?.isPremiumUser,
                membershipType: profileInfo?.membershipType,
                membershipStartDate: profileInfo?.membershipStartDate,
                membershipEndDate: profileInfo?.membershipEndDate,
                candidateInfo: {
                    ...candidateFormData,
                    resume: profileInfo?.resume
                }
            }
            : {
                _id: profileInfo?._id,
                userId: profileInfo?.userId,
                role: profileInfo?.role,
                email: profileInfo?.email,
                isPremiumUser: profileInfo?.isPremiumUser,
                membershipType: profileInfo?.membershipType,
                membershipStartDate: profileInfo?.membershipStartDate,
                membershipEndDate: profileInfo?.membershipEndDate,
                recruiterInfo: { ...recruiterFormData }
            }, '/account')
    }

    return (
        <div className="mx-auto max-w-7xl">
            <div className="flex items-baseline justify-between border-b pb-6 pt-24">
                <h1 className="text-4xl font-bold text-gray-950 tracking-tight">Account Details</h1>
            </div>
            <div className="py-20 pb-24 pt-6">
                <div className="container mx-auto p-0 space-y-8">
                    <CommonForm
                        action={handleUpdateAccount}
                        formControls={
                            profileInfo?.role === 'candidate' ? candidateOnboardFormControls.filter(formControl => formControl.name !== 'resume') : recruiterOnboardFormControls
                        }
                        formData={profileInfo?.role === 'candidate' ? candidateFormData : recruiterFormData}
                        setFormData={profileInfo?.role === 'candidate' ? setCandidateFormData : setRecruiterFormData}
                        buttonText='Update Profile'
                    />
                </div>
            </div>
        </div>
    )
}

export default AccountInfo