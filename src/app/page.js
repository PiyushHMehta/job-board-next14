import { fetchProfileAction } from '@/actions';
import { Button } from '@/components/ui/button';
import { currentUser } from '@clerk/nextjs/server'
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Fragment } from 'react';

// if user authenticated -> check if profile info present(candidate/ recruiter), if not profile info -> redirect the user to /onboard route


export default async function Home() {
	const user = await currentUser()
	// console.log(user);

	const profileInfo = await fetchProfileAction(user?.id)

	if (user && !profileInfo?._id) {
		redirect('/onboard')
	}

	return (
		<Fragment>
			<div className='bg-white'>
				<div className='relative w-full'>
					<div className='min-h-screen flex'>
						<div className='container m-auto p-0'>
							<div className='flex items-center flex-wrap gap-12 lg:gap-0'>
								<div className='w-5/12 space-y-8'>
									<span className='flex space-x-2'>
										<span className='block w-14 mb-2 border-b-2 border-gray-700'></span>
										<span className='font-medium text-gray-600'>
											One stop solution to find jobs
										</span>
									</span>
									<h1 className='text-4xl font-black md:text-6xl'>
										The Best <br /> Job Portal App
									</h1>
									<p className='text-xl text-gray-700'>
										Find best jobs from top product based companies and build your career
									</p>
									<div className='flex items-center gap-8'>
										{
											profileInfo?.role === 'candidate' && <Link href={'/jobs'}
												className='py-2 px-4 bg-gray-900 rounded-md text-white'>
												Browse Jobs
											</Link>
										}
										{
											profileInfo?.role === 'candidate'
												? <Link href={'/activity'}
													className='py-2 px-4 bg-gray-900 rounded-md text-white'>
													Activity
												</Link>
												: <Link href={'/jobs'}
													className='py-2 px-4 bg-gray-900 rounded-md text-white'>
													Post New Job
												</Link>
										}
									</div>
								</div>
								<div className='hidden relative md:block lg:w-7/12'>
									<img src='https://shorturl.at/msw07' alt='Job Portal' className='relative ml-auto' />
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Fragment>
	);
}
