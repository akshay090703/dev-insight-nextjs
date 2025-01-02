'use client'

import { api } from "@/trpc/react"

type Props = {
    meetingId: string
}

const IssuesList = ({ meetingId }: Props) => {
    const { data: meeting, isLoading } = api.project.getMeetingById.useQuery({ meetingId }, {
        refetchInterval: 4000
    });
    if (!isLoading || !meeting) return <div>Loading...</div>

    return (
        <>
            <div className="p-8">
                <div className="mx-auto flex max-w-2xl items-center justify-between gap-x-8 border-b pb-6 lg:mx-0 lg:max-w-none">
                    <div>

                    </div>
                </div>
            </div>
        </>
    )
}

export default IssuesList