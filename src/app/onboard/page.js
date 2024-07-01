import { fetchProfileAction } from "@/actions"
import OnBoard from "@/components/on-board"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

async function OnBoardPage() {
    // get the auth user from clerk
    const user = await currentUser()

    // fetch profile info
    const profileInfo = await fetchProfileAction(user?.id)

    if (profileInfo?._id) {   // this id is from mongodb, _id means the user is onboard
        if (profileInfo?.role === 'recruiter') {
            if (!profileInfo?.isPremiumUser) {
                redirect('/membership')
            } else {
                redirect('/')   // already a member
            }
        } else {
            // candidate
            redirect('/')
        }
    }

    return (
        <OnBoard />
    )
}

export default OnBoardPage