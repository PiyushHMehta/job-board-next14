'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useEffect, useState } from "react"
import CommonForm from "../common-form"
import { candidateOnboardFormControls, initialCandidateFormData, initialRecruiterFormData, recruiterOnboardFormControls } from "@/utils"
import { createProfile, createProfileAction } from "@/actions"
import { useUser } from "@clerk/nextjs"
import { createClient } from "@supabase/supabase-js"

const supabaseClient = createClient('https://wcemqtzsglbnqaqeinqq.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndjZW1xdHpzZ2xibnFhcWVpbnFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTk3NTIzNDAsImV4cCI6MjAzNTMyODM0MH0.YaZuxm9fz7TX_ZkNPWw2d2w0xmgJNTGdcMPyReNj19E')

function OnBoard() {
    const [currentTab, setCurrentTab] = useState('candidate')
    const [recruiterFormData, setRecruiterFormData] = useState(initialRecruiterFormData)
    const [candidateFormData, setCandidateFormData] = useState(initialCandidateFormData)
    const [file, setFile] = useState(null)

    const currentAuthUser = useUser()
    const { user } = currentAuthUser

    function handleTabChange(value) {
        setCurrentTab(value)
    }
    // console.log(recruiterFormData);
    // console.log(candidateFormData);

    function handleRecruiterFormValid() {
        return Object.keys(recruiterFormData).every(key => {
            if (typeof recruiterFormData[key] === 'string') {
                return recruiterFormData[key].trim() !== '';
            }
            return true;
        });
    }

    function handleCandidateFormValid() {
        return Object.keys(candidateFormData).every(key => {
            if (typeof candidateFormData[key] === 'string') {
                return candidateFormData[key].trim() !== '';
            }
            return true;
        });
    }


    // create profile
    async function createProfile() {
        const data = currentTab === 'candidate' ? {
            candidateInfo: candidateFormData,
            role: 'candidate',
            isPremiumUser: false,
            userId: user?.id,
            email: user?.primaryEmailAddress?.emailAddress,
        } : {
            recruiterInfo: recruiterFormData,
            role: 'recruiter',
            isPremiumUser: false,
            userId: user?.id,
            email: user?.primaryEmailAddress?.emailAddress,
        }

        await createProfileAction(data, '/onboard')
    }

    function handleFileChange(e) {
        e.preventDefault()
        // console.log(e.target.files);
        setFile(e.target.files[0])
    }

    async function handleUploadPdfToSupabase() {
        const { data, error } = await supabaseClient.storage.from('job-board-public').upload(`/public/${file.name}`, file, {
            cacheControl: '3600',
            upsert: false
        })

        console.log(data, error);

        if (data) {
            setCandidateFormData({
                ...candidateFormData,
                resume: data.path,
            })
        }
    }
    // pdf we are saving in supabase, from there we get the path where our resume is stored, the path string is saved in resume field in mongodb, now if we want to access resume we can get it using path saved in resume

    useEffect(() => {
        if (file) {
            handleUploadPdfToSupabase()
        }
    }, [file])

    return (
        <div className="bg-white">
            <Tabs value={currentTab} onValueChange={handleTabChange}>
                <div className="w-full">
                    <div className="flex items-baseline justify-between border-b pb-6 pt-24">
                        <h1 className="text-4xl font-black tracking-tight text-gray-900">
                            Welcome to onboarding
                        </h1>
                        <TabsList>
                            <TabsTrigger value='candidate'>
                                Candidate
                            </TabsTrigger>
                            <TabsTrigger value='recruiter'>
                                Recruiter
                            </TabsTrigger>
                        </TabsList>
                    </div>
                </div>
                <TabsContent value='candidate'>
                    <CommonForm
                        action={createProfile}
                        formControls={candidateOnboardFormControls}
                        buttonText={'Onboard as canidate'}
                        formData={candidateFormData}
                        setFormData={setCandidateFormData}
                        isButtonDisabled={!handleCandidateFormValid()}
                        handleFileChange={handleFileChange}
                    />
                </TabsContent>
                <TabsContent value='recruiter'>
                    <CommonForm
                        formControls={recruiterOnboardFormControls}
                        buttonText={'Onboard as recruiter'}
                        formData={recruiterFormData}
                        setFormData={setRecruiterFormData}
                        isButtonDisabled={!handleRecruiterFormValid()}
                        action={createProfile} />
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default OnBoard