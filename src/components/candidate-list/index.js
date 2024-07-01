'use client'

import React, { Fragment } from 'react'
import { Button } from '../ui/button'
import { Dialog, DialogContent, DialogFooter } from '../ui/dialog'
import { getCandidateDetailsByIdAction, updateJobApplicationAction } from '@/actions'
import { createClient } from '@supabase/supabase-js'

function CandidateList({ currentCandidateDetails, setCurrentCandidateDetails, JobApplicants, showCurrentCandidateDetailsModal, setShowCurrentCandidateDetailsModal }) {

    const supabaseClient = createClient('https://wcemqtzsglbnqaqeinqq.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndjZW1xdHpzZ2xibnFhcWVpbnFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTk3NTIzNDAsImV4cCI6MjAzNTMyODM0MH0.YaZuxm9fz7TX_ZkNPWw2d2w0xmgJNTGdcMPyReNj19E')

    async function handleFetchCandidateDetails(candidateId) {
        const data = await getCandidateDetailsByIdAction(candidateId)
        // console.log(data);
        if (data) {
            setCurrentCandidateDetails(data)
            setShowCurrentCandidateDetailsModal(true)
        }
    }

    // console.log(currentCandidateDetails);

    function handlePreviewResume() {
        const { data } = supabaseClient.storage.from('job-board-public').getPublicUrl(currentCandidateDetails?.candidateInfo?.resume)

        // console.log(data);
        const a = document.createElement('a')
        a.href = data.publicUrl
        a.setAttribute('download', 'Resume.pdf')
        a.setAttribute('target', '_blank')
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
    }

    async function handleUpdateJobStatus(getCurrentStatus) {
        let copyJobApplicants = [...JobApplicants]
        const indexOfCurrentJobApplicant = copyJobApplicants.findIndex(item => item?.candidateUserId === currentCandidateDetails?.userId)
        const JobApplicantsToUpdate = {
            ...copyJobApplicants[indexOfCurrentJobApplicant],
            status: copyJobApplicants[indexOfCurrentJobApplicant].status.concat(getCurrentStatus)
        }
        await updateJobApplicationAction(JobApplicantsToUpdate, '/jobs')
    }

    return (
        <Fragment>
            <div className='grid grid-cols-1 gap-3 p-10 md:grid-cols-2 lg:grid-cols-3'>
                {
                    JobApplicants && JobApplicants.length > 0 ? (
                        JobApplicants.map(item => (
                            <div className='bg-white shadow-lg w-full max-w-sm rounded-lg overflow-hidden mx-auto mt-4'>
                                <div className='px-4 my-6 flex justify-between items-center'>
                                    <h3 className='text-lg font-bold'>{item.name}</h3>
                                    <Button
                                        onClick={() => handleFetchCandidateDetails(item?.candidateUserId)}
                                        className='flex h-11 items-center justify-center px-5'>View</Button>
                                </div>
                            </div>
                        ))
                    ) : null
                }
            </div>

            <Dialog open={showCurrentCandidateDetailsModal}
                onOpenChange={() => {
                    setCurrentCandidateDetails(null)
                    setShowCurrentCandidateDetailsModal(false)
                }}>
                <DialogContent>
                    <div>
                        <h1 className='text-2xl font-bold text-black'>
                            {currentCandidateDetails?.candidateInfo?.name}, {currentCandidateDetails?.email}
                        </h1>
                        <p className='text-xl font-medium text-black'>Current Company: {currentCandidateDetails?.candidateInfo?.currentCompany}</p>
                        <p className='text-sm font-normal text-black'>
                            Current Job Location: {currentCandidateDetails?.candidateInfo?.currentJobLocation}
                        </p>
                        <p className='text-sm font-normal text-black'>
                            Total Experience: {currentCandidateDetails?.candidateInfo?.totalExperience}
                        </p>
                        <p className='text-sm font-normal text-black'>
                            Salary: {currentCandidateDetails?.candidateInfo?.currentSalary}
                        </p>
                        <p className='text-sm font-normal text-black'>
                            Notice Period: {currentCandidateDetails?.candidateInfo?.noticePeriod}
                        </p>
                        <p className='text-sm font-normal text-black'>
                            Preferred Job Location: {currentCandidateDetails?.candidateInfo?.preferedJobLocation}
                        </p>
                        <div className='flex flex-wrap gap-4 mt-6'>
                            {
                                currentCandidateDetails?.candidateInfo?.skills.split(',').map(skill => (
                                    <div className="px-4 py-2 flex justify-center items-center bg-black rounded-[4px]">
                                        <h2 className="text-[13px] font-medium text-white">{skill}</h2>
                                    </div>
                                ))
                            }
                        </div>
                        <div className='flex flex-wrap items-center gap-4 mt-6'>
                            <h1>Pervious Companies</h1>
                            {
                                currentCandidateDetails?.candidateInfo?.previousCompanies.split(',').map(company => (
                                    <div className="w-[100px] flex justify-center items-center h-[35px] bg-black rounded-[4px]">
                                        <h2 className="text-[13px] font-medium text-white">{company}</h2>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                    <div className='flex gap-3'>
                        <Button onClick={handlePreviewResume}>Resume</Button>
                        <Button
                            onClick={() => handleUpdateJobStatus('Selected')}
                            disabled={
                                JobApplicants.find(item => item?.candidateUserId === currentCandidateDetails?.userId)?.status.includes('Selected')
                                    || JobApplicants.find(item => item?.candidateUserId === currentCandidateDetails?.userId)?.status.includes('Rejected')
                                    ? true : false
                            }
                            className='disabled:opacity-65'
                        >
                            {
                                JobApplicants.find(item => item?.candidateUserId === currentCandidateDetails?.userId)?.status.includes('Selected') ? 'Selected' : 'Select'
                            }
                        </Button>
                        <Button
                            onClick={() => handleUpdateJobStatus('Rejected')}
                            disabled={
                                JobApplicants.find(item => item?.candidateUserId === currentCandidateDetails?.userId)?.status.includes('Selected')
                                    || JobApplicants.find(item => item?.candidateUserId === currentCandidateDetails?.userId)?.status.includes('Rejected')
                                    ? true : false
                            }
                            className='disabled:opacity-65'
                        >
                            {
                                JobApplicants.find(item => item?.candidateUserId === currentCandidateDetails?.userId)?.status.includes('Rejected') ? 'Rejected' : 'Reject'
                            }
                        </Button>

                    </div>
                </DialogContent>
            </Dialog>
        </Fragment>
    )
}

export default CandidateList